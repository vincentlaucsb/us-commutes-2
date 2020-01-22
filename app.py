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
                Queries.saved_queries[sql] = cur.fetchall()
                return Queries.saved_queries[sql]

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
@cross_origin("/")
def hello():
    return jsonify("Hello, World!")

@app.route("/map")
@cross_origin("/map")
def map():
    query = '''SELECT
    jsonb_build_object('type', 'FeatureCollection') ||
    jsonb_build_object('features', array_agg(features))
FROM (
WITH _features AS (
    SELECT jsonb_array_elements(data->'features') AS features
    FROM counties
)
SELECT
    F.features || jsonb_build_object('properties', F.features->'properties' || jsonb_build_object(
        /* Mean Travel Time */
        'HC01_EST_VC55',D1."HC01_EST_VC55",
        'HC01_EST_VC55_RANK', rank() OVER (ORDER BY D1."HC01_EST_VC55" ASC),
        'HC01_EST_VC55_STATE_RANK', rank() OVER (PARTITION BY S."STATE" ORDER BY D1."HC01_EST_VC55" ASC),
        
        /* Travel Time Categories */
        'HC01_EST_VC46',D1."HC01_EST_VC46",
        'HC02_EST_VC46',D1."HC02_EST_VC46",
        'HC03_EST_VC46',D1."HC03_EST_VC46",
        'HC01_EST_VC47',D1."HC01_EST_VC47",
        'HC02_EST_VC47',D1."HC02_EST_VC47",
        'HC03_EST_VC47',D1."HC03_EST_VC47",
        'HC01_EST_VC48',D1."HC01_EST_VC48",
        'HC02_EST_VC48',D1."HC02_EST_VC48",
        'HC03_EST_VC48',D1."HC03_EST_VC48",
        'HC01_EST_VC49',D1."HC01_EST_VC49",
        'HC02_EST_VC49',D1."HC02_EST_VC49",
        'HC03_EST_VC49',D1."HC03_EST_VC49",
        'HC01_EST_VC50',D1."HC01_EST_VC50",
        'HC02_EST_VC50',D1."HC02_EST_VC50",
        'HC03_EST_VC50',D1."HC03_EST_VC50",
        'HC01_EST_VC51',D1."HC01_EST_VC51",
        'HC02_EST_VC51',D1."HC02_EST_VC51",
        'HC03_EST_VC51',D1."HC03_EST_VC51",
        'HC01_EST_VC52',D1."HC01_EST_VC52",
        'HC02_EST_VC52',D1."HC02_EST_VC52",
        'HC03_EST_VC52',D1."HC03_EST_VC52",
        'HC01_EST_VC53',D1."HC01_EST_VC53",
        'HC02_EST_VC53',D1."HC02_EST_VC53",
        'HC03_EST_VC53',D1."HC03_EST_VC53",
        'HC01_EST_VC54',D1."HC01_EST_VC54",
        'HC02_EST_VC54',D1."HC02_EST_VC54",
        'HC03_EST_VC54',D1."HC03_EST_VC54",
        'HC01_EST_VC55',D1."HC01_EST_VC55",
        'HC02_EST_VC55',D1."HC02_EST_VC55",
        'HC03_EST_VC55',D1."HC03_EST_VC55",
        
        /* Mode of Transport */
        'HC01_EST_VC03',D1."HC01_EST_VC03",
        'HC01_EST_VC04',D1."HC01_EST_VC04",
        'HC01_EST_VC05',D1."HC01_EST_VC05",
        'HC01_EST_VC10',D1."HC01_EST_VC10",
        'HC01_EST_VC11',D1."HC01_EST_VC11",
        'HC01_EST_VC12',D1."HC01_EST_VC12",
        'HC01_EST_VC13',D1."HC01_EST_VC13",
        'HC01_EST_VC14',D1."HC01_EST_VC14", /* Work at home */
        
        /* State Name */
        'STATE_NAME',S."STATE_NAME"
    )) AS features
FROM
    _features F,
    "ACS_16_5YR_S0801_with_ann.csv" D1,
    "state.txt" S
WHERE
    D1."GEO.id" = (F.features->'properties'->>'GEO_ID') AND
    S."STATE" = (F.features->'properties'->>'STATE')::bigint
) as subquery'''

    return jsonify(Queries.query(query)[0][0]);


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

    return jsonify(Queries.query(query)[0][0]);