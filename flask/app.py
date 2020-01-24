from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
from os import getenv
import psycopg2

PG_PASSWORD = getenv('US_COMMUTES_PASS')

class Queries(object):
    saved_queries = dict()

    @staticmethod
    def query(sql: str):
        try:
            return Queries.saved_queries[sql]
        except KeyError:
            with psycopg2.connect("dbname=us-commutes user=postgres password={pwd}".format(pwd=PG_PASSWORD)) as conn:
                cur = conn.cursor()
                cur.execute(sql);

                result = cur.fetchall()
                if len(result) == 1:
                    result = result[0]

                    if len(result) == 1:
                        result = result[0]

                Queries.saved_queries[sql] = jsonify(result)
                return result

def init_db():
    with psycopg2.connect("dbname=us-commutes user=postgres password={pwd}".format(pwd=PG_PASSWORD)) as conn:
        cur = conn.cursor()

def init_app():
    init_db()
    app = Flask(__name__)
    return app

app = init_app()
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
@cross_origin("/")
def hello():
    return jsonify("Hello, World!")

@app.route("/map")
@cross_origin("/map")
def map():
    query = '''
    SELECT
        jsonb_build_object('type', 'FeatureCollection')
        || jsonb_build_object('features', array_agg(features))
    FROM (
        WITH _features AS (
            SELECT jsonb_array_elements(data->'features') AS features
            FROM counties
        )
        SELECT
            F.features
            || jsonb_build_object(
                'properties', F.features->'properties'
                    || jsonb_build_object(
                        /* Mean Travel Time */
                        'HC01_EST_VC55_RANK', rank() OVER (ORDER BY D1."HC01_EST_VC55" ASC),
                        'HC01_EST_VC55_STATE_RANK', rank() OVER (PARTITION BY S."STATE" ORDER BY D1."HC01_EST_VC55" ASC),
        
                        /* State Name */
                        'STATE_NAME',S."STATE_NAME"
                    )   
                    || to_jsonb(row_to_json(D1))
            ) AS features
        FROM
            _features F,
            "ACS_16_5YR_S0801_with_ann.csv" D1,
            "state.txt" S
        WHERE
            D1."GEO.id" = (F.features->'properties'->>'GEO_ID') AND
        S."STATE" = (F.features->'properties'->>'STATE')::bigint
    ) as subquery
    '''

    return Queries.query(query)


@app.route("/percentiles/<column>")
@cross_origin("/percentiles/<column>")
def percentiles(column): 
    query = '''SELECT jsonb_build_object(
        0.125, percentile_cont(0.125) WITHIN GROUP(ORDER BY "{col}"),
        0.25, percentile_cont(0.25) WITHIN GROUP(ORDER BY "{col}"),
        0.375, percentile_cont(0.375) WITHIN GROUP(ORDER BY "{col}"),
        0.5, percentile_cont(0.5) WITHIN GROUP(ORDER BY "{col}"),
        0.625, percentile_cont(0.625) WITHIN GROUP(ORDER BY "{col}"),
        0.75, percentile_cont(0.75) WITHIN GROUP(ORDER BY "{col}"),
        0.875, percentile_cont(0.875) WITHIN GROUP(ORDER BY "{col}")
    ) FROM "ACS_16_5YR_S0801_with_ann.csv"
    '''.format(col=column)

    return Queries.query(query)