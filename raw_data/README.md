Populate a PostgreSQL database with this data

## Commands
`psql --username=postgres --dbname=us-commutes -f ACS_16_5YR_S0801.sql`

### To create Django models
From the project root directory:
`python manage.py inspectdb --database=us-commutes > us_commutes_ii/models.py`

### To Upload GeoJSON US County Data
 
 1. Create a table with a `JSONB` column
 1. Import the JSON file into that column