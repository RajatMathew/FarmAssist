import datetime as dt
import meteomatics.api as api
from dotenv import load_dotenv
import os
import json
import pandas as pd

def get_precipitation_forecast(lat, lng):
    load_dotenv()

    username = os.getenv('METEO_USERNAME')
    password = os.getenv('METEO_PASSWORD')

    coordinates = [(lat, lng)]
    parameters = ['precip_1h:mm', 't_2m:C']
    model = 'mix'
    startdate = dt.datetime.now().replace(minute=0, second=0, microsecond=0)
    enddate = startdate + dt.timedelta(days=1)
    interval = dt.timedelta(hours=1)

    df = api.query_time_series(coordinates, startdate, enddate, interval, parameters, username, password, model=model)
    
    print(df)
    
    # Print dataframe info for debugging
    print("Dataframe Info:")
    print(df.info())
    print("\nDataframe Head:")
    print(df.head())
    print("\nDataframe Index:")
    print(df.index)

    # Convert the dataframe to the desired JSON format
    result = []
    for index, row in df.iterrows():
        # Handle different possible index structures
        if isinstance(index, pd.Timestamp):
            date = index
        elif isinstance(index, tuple) and len(index) > 1 and isinstance(index[1], pd.Timestamp):
            date = index[1]
        else:
            # If we can't determine the date, use the current date/time
            date = dt.datetime.now()

        result.append({
            "date": date.strftime("%Y-%m-%d %H:%M:%S"),
            "precipitation": round(float(row.iloc[0]), 2),  # Assuming precipitation is the first (and only) column
            "temperature": round(float(row.iloc[1]), 2)  # Assuming temperature is the second column
        })
    
    return json.dumps(result)

# Example usage
if __name__ == "__main__":
    lat, lng = 10.43, 76.16  # Example coordinates
    forecast = get_precipitation_forecast(lat, lng)
    
    print("\nForecasted Data:")
    print(forecast)