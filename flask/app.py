from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
from os import getenv
import psycopg2
import pickle

from secret import PG_PASSWORD

class Queries(object):
    @staticmethod
    def query(sql: str):
        try:
            with open('cache-{}'.format(hash(sql)), mode='rb') as infile:
                return pickle.load(infile)
                
        except FileNotFoundError:
            with psycopg2.connect("host=localhost dbname=us-commutes user=postgres password={pwd}".format(pwd=PG_PASSWORD)) as conn:
                cur = conn.cursor()
                cur.execute(sql);

                result = cur.fetchall()
                if len(result) == 1:
                    result = result[0]

                    if len(result) == 1:
                        result = result[0]

                # Cache the response
                data = jsonify(result)
                with open('cache-{}'.format(hash(sql)), mode='wb') as outfile:
                    pickle.dump(data, outfile)

                return data

def init_db():
    with psycopg2.connect("host=localhost dbname=us-commutes user=postgres password={pwd}".format(pwd=PG_PASSWORD)) as conn:
        cur = conn.cursor()
        cur.execute('''
        DROP VIEW IF EXISTS commute_times;
        CREATE VIEW commute_times AS
        SELECT
            "GEO.id",

            /* Workers 16 years and over */
            "HC01_EST_VC01", "HC02_EST_VC01", "HC03_EST_VC01", 

            /* Travel Time Categories */
            "HC01_EST_VC46", "HC02_EST_VC46", "HC03_EST_VC46",
            "HC01_EST_VC47", "HC02_EST_VC47", "HC03_EST_VC47",
            "HC01_EST_VC48", "HC02_EST_VC48", "HC03_EST_VC48",
            "HC01_EST_VC49", "HC02_EST_VC49", "HC03_EST_VC49",
            "HC01_EST_VC50", "HC02_EST_VC50", "HC03_EST_VC50",
            "HC01_EST_VC51", "HC02_EST_VC51", "HC03_EST_VC51",
            "HC01_EST_VC52", "HC02_EST_VC52", "HC03_EST_VC52",
            "HC01_EST_VC53", "HC02_EST_VC53", "HC03_EST_VC53", /* 45-59 minutes */
            "HC01_EST_VC54", "HC02_EST_VC54", "HC03_EST_VC54", /* 60+ minutes */
            "HC01_EST_VC55", "HC02_EST_VC55", "HC03_EST_VC55", /* Mean Travel Time */

            ("HC01_EST_VC53" + "HC02_EST_VC53" + "HC03_EST_VC53") as "LONG_COMMUTES",
        
            /* Location of Work */
            "HC01_EST_VC19", /* Outside county */
            "HC01_EST_VC20", /* Outside state */

            /* Mode of Transport */
            "HC01_EST_VC03", "HC02_EST_VC03", "HC03_EST_VC03",
            "HC01_EST_VC04", "HC02_EST_VC04", "HC03_EST_VC04",
            "HC01_EST_VC05", "HC02_EST_VC05", "HC03_EST_VC05",
            "HC01_EST_VC10", "HC02_EST_VC10", "HC03_EST_VC10",
            "HC01_EST_VC11", "HC02_EST_VC11", "HC03_EST_VC11",
            "HC01_EST_VC12", "HC02_EST_VC12", "HC03_EST_VC12",
            "HC01_EST_VC13", "HC02_EST_VC13", "HC03_EST_VC13",
            "HC01_EST_VC14", "HC02_EST_VC14", "HC03_EST_VC14" /* Work at home */
        
        FROM "ACS_16_5YR_S0801_with_ann.csv";
''')

def init_app():
    init_db()
    app = Flask(__name__)
    return app

app = init_app()
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
@cross_origin()
def hello():
    return jsonify("Hello, World!")

@app.route("/map")
@cross_origin()
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
            commute_times D1,
            "state.txt" S
        WHERE
            D1."GEO.id" = (F.features->'properties'->>'GEO_ID') AND
            S."STATE" = (F.features->'properties'->>'STATE')::bigint
    ) as subquery
    '''

    return Queries.query(query)


@app.route("/percentiles/<column>")
@cross_origin()
def percentiles(column): 
    query = '''SELECT jsonb_build_object(
        0.125, percentile_cont(0.125) WITHIN GROUP(ORDER BY "{col}"),
        0.25, percentile_cont(0.25) WITHIN GROUP(ORDER BY "{col}"),
        0.375, percentile_cont(0.375) WITHIN GROUP(ORDER BY "{col}"),
        0.5, percentile_cont(0.5) WITHIN GROUP(ORDER BY "{col}"),
        0.625, percentile_cont(0.625) WITHIN GROUP(ORDER BY "{col}"),
        0.75, percentile_cont(0.75) WITHIN GROUP(ORDER BY "{col}"),
        0.875, percentile_cont(0.875) WITHIN GROUP(ORDER BY "{col}")
    ) FROM commute_times
    '''.format(col=column)

    return Queries.query(query)
	
if __name__ == "__main__":
	app.run(host="0.0.0.0")