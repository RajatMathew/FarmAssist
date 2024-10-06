import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict, List
from langchain_groq import ChatGroq

# Load environment variables from .env file
load_dotenv()

# Ensure the API key is set
if "GROQ_API_KEY" not in os.environ:
    raise EnvironmentError("Please set the GROQ_API_KEY environment variable.")

# Initialize the LLM
llm = ChatGroq(
    model="llama-3.1-70b-versatile",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)

app = FastAPI()

# Add CORS middleware to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,  # Allow credentials (e.g., cookies)
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class ChatResponse(BaseModel):
    response: str


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Convert the incoming messages to the format expected by the LLM
        llm_messages = [(msg.role, msg.content) for msg in request.messages]
        
        # Invoke the LLM
        ai_msg = llm.invoke(llm_messages)
        
        # Return the response
        return ChatResponse(response=ai_msg.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



class PrecipRequest(BaseModel):
    lat: float
    lng: float

from meteo import get_precipitation_forecast
@app.post("/get-precip-data")
async def chat(request: PrecipRequest):
    try:
        return get_precipitation_forecast(request.lat, request.lng)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

        
import httpx

AMBEE_API_KEY = os.getenv("AMBEE_API_KEY")

class Location(BaseModel):
    lat: float
    lng: float
    
# @app.post("/get-ambee-weather")
# async def get_weather(location: Location):
#     if not AMBEE_API_KEY:
#         raise HTTPException(status_code=500, detail="API key not configured")

#     url = f"https://api.ambeedata.com/weather/latest/by-lat-lng?lat={location.lat}&lng={location.lng}"
#     headers = {
#         "x-api-key": AMBEE_API_KEY,
#     }

#     async with httpx.AsyncClient() as client:
#         response = await client.get(url, headers=headers)
#         if response.status_code != 200:
#             raise HTTPException(status_code=response.status_code, detail="Failed to fetch weather data")

#         return response.json()   
    
    
    





import numpy as np


import pandas as pd

from sklearn.neighbors import KNeighborsClassifier
# Importing sklearn library. This is a very powerfull library for machine learning. Scikit-learn is probably the most useful library for machine learning in Python. The sklearn library contains a lot of efficient tools for machine learning and statistical modeling including classification, regression, clustering and dimensionality reduction.
from sklearn import preprocessing

class PredictionRequest(BaseModel):
    nitrogen_content: float
    phosphorus_content: float
    potassium_content: float
    temperature_content: float
    humidity_content: float
    ph_content: float
    rainfall: float

    # Importing pyttsx3 library to convert text into speech.
    # Importing pysimplegui to make a Graphical User Interface.


# Importing our excel data from a specific file.
excel = pd.read_excel('crop.xlsx', header=0)
# Printing our excel file data.
print(excel)
# Checking out the shape of our data.
print(excel.shape)


# Various machine learning algorithms require numerical input data, so you need to represent categorical columns in a numerical column. In order to encode this data, you could map each value to a number. This process is known as label encoding, and sklearn conveniently will do this for you using Label Encoder.
le = preprocessing.LabelEncoder()
# Mapping the values in weather into numerical form.
crop = le.fit_transform(list(excel["CROP"]))


# Making the whole row consisting of nitrogen values to come into nitrogen.
NITROGEN = list(excel["NITROGEN"])
# Making the whole row consisting of phosphorus values to come into phosphorus.
PHOSPHORUS = list(excel["PHOSPHORUS"])
# Making the whole row consisting of potassium values to come into potassium.
POTASSIUM = list(excel["POTASSIUM"])
# Making the whole row consisting of temperature values to come into temperature.
TEMPERATURE = list(excel["TEMPERATURE"])
# Making the whole row consisting of humidity values to come into humidity.
HUMIDITY = list(excel["HUMIDITY"])
# Making the whole row consisting of ph values to come into ph.
PH = list(excel["PH"])
# Making the whole row consisting of rainfall values to come into rainfall.
RAINFALL = list(excel["RAINFALL"])


# Zipping all the features together
features = list(zip(NITROGEN, PHOSPHORUS, POTASSIUM,
                TEMPERATURE, HUMIDITY, PH, RAINFALL))
# Converting all the features into a array form
features = np.array([NITROGEN, PHOSPHORUS, POTASSIUM,
                    TEMPERATURE, HUMIDITY, PH, RAINFALL])

# Making transpose of the features
features = features.transpose()
# Printing the shape of the features after getting transposed.
print(features.shape)
# Printing the shape of crop. Please note that the shape of the features and crop should match each other to make predictions.
print(crop.shape)

# The number of neighbors is the core deciding factor. K is generally an odd number if the number of classes is 2. When K=1, then the algorithm is known as the nearest neighbor algorithm.
model = KNeighborsClassifier(n_neighbors=3)
# fit your model on the train set using fit() and perform prediction on the test set using predict().
model.fit(features, crop)

@app.post("/get-prediction")
def get_prediction(data: PredictionRequest):

    # nitrogen_content =         60
    #                                                                                                # Taking input from the user about nitrogen content in the soil.
    # phosphorus_content =       40                                                                                                        # Taking input from the user about phosphorus content in the soil.
    # potassium_content =        20                                                                                                        # Taking input from the user about potassium content in the soil.
    # temperature_content =      25                                                                                                        # Taking input from the user about the surrounding temperature.
    # humidity_content =         80                                                                                                        # Taking input from the user about the surrounding humidity.
    # ph_content =               6.8                                                                                                        # Taking input from the user about the ph level of the soil.
    # rainfall =                 88

    nitrogen_content = data.nitrogen_content
    phosphorus_content = data.phosphorus_content
    potassium_content = data.potassium_content
    temperature_content = data.temperature_content
    humidity_content = data.humidity_content
    ph_content = data.ph_content
    rainfall = data.rainfall
    
    
    
    crop_name = str()
    humidity_level = str()
    temperature_level = str()
    rainfall_level = str()
    nitrogen_level = str()
    phosphorus_level = str()
    potassium_level = str()
    phlevel = str()

    # Taking input from the user about the rainfall.
    # Converting all the data that we collected from the user into a array form to make further predictions.
    predict1 = np.array([nitrogen_content, phosphorus_content, potassium_content,
                        temperature_content, humidity_content, ph_content, rainfall], dtype=float)
    # Printing the data after being converted into a array form.
    print(predict1)
    # Reshaping the input data so that it can be applied in the model for getting accurate results.
    predict1 = predict1.reshape(1, -1)
    # Printing the input data value after being reshaped.
    print(predict1)
    # Applying the user input data into the model.
    predict1 = model.predict(predict1)
    # Finally printing out the results.
    print(predict1)
    crop_name = str()
    # Above we have converted the crop names into numerical form, so that we can apply the machine learning model easily. Now we have to again change the numerical values into names of crop so that we can print it when required.
    if predict1 == 0:
        crop_name = 'Apple(ആപ്പിൾ)'
    elif predict1 == 1:
        crop_name = 'Banana(നേന്ത്രപ്പഴം)'
    elif predict1 == 2:
        crop_name = 'Blackgram(ബ്ലാക്ക്ഗ്രാം)'
    elif predict1 == 3:
        crop_name = 'Chickpea(കടല)'
    elif predict1 == 4:
        crop_name = 'Coconut(നാളികേരം)'
    elif predict1 == 5:
        crop_name = 'Coffee(കാപ്പി)'
    elif predict1 == 6:
        crop_name = 'Cotton(പരുത്തി)'
    elif predict1 == 7:
        crop_name = 'Grapes(മുന്തിരി)'
    elif predict1 == 8:
        crop_name = 'Jute(ചണം)'
    elif predict1 == 9:
        crop_name = 'Kidneybeans(അമര പയർ)'
    elif predict1 == 10:
        crop_name = 'Lentil(പയർ)'
    elif predict1 == 11:
        crop_name = 'Maize(ചോളം)'
    elif predict1 == 12:
        crop_name = 'Mango(മാമ്പഴം)'
    elif predict1 == 13:
        crop_name = 'Mothbeans(വൻപയർ)'
    elif predict1 == 14:
        crop_name = 'Mungbeans(ചെറുപയർ)'
    elif predict1 == 15:
        crop_name = 'Muskmelon(കസ്തൂരി മത്തങ്ങ)'
    elif predict1 == 16:
        crop_name = 'Orange(ഓറഞ്ച്)'
    elif predict1 == 17:
        crop_name = 'Papaya(പപ്പായ)'
    elif predict1 == 18:
        crop_name = 'Pigeonpeas(പരിപ്പ്)'
    elif predict1 == 19:
        crop_name = 'Pomegranate(മാതളനാരങ്ങ)'
    elif predict1 == 20:
        crop_name = 'Rice(അരി)'
    elif predict1 == 21:
        crop_name = 'Watermelon(തണ്ണിമത്തൻ)'

    # Here I have divided the humidity values into three categories i.e low humid, medium humid, high humid.
    if int(humidity_content) >= 1 and int(humidity_content) <= 33:
        humidity_level = 'low humid'
    elif int(humidity_content) >= 34 and int(humidity_content) <= 66:
        humidity_level = 'medium humid'
    else:
        humidity_level = 'high humid'

    # Here I have divided the temperature values into three categories i.e cool, warm, hot.
    if int(temperature_content) >= 0 and int(temperature_content) <= 6:
        temperature_level = 'cool'
    elif int(temperature_content) >= 7 and int(temperature_content) <= 25:
        temperature_level = 'warm'
    else:
        temperature_level = 'hot'

    # Here I have divided the humidity values into three categories i.e less, moderate, heavy rain.
    if int(rainfall) >= 1 and int(rainfall) <= 100:
        rainfall_level = 'less'
    elif int(rainfall) >= 101 and int(rainfall) <= 200:
        rainfall_level = 'moderate'
    elif int(rainfall) >= 201:
        rainfall_level = 'heavy rain'

    # Here I have divided the nitrogen values into three categories.
    if int(nitrogen_content) >= 1 and int(nitrogen_content) <= 50:
        nitrogen_level = 'less'
    elif int(nitrogen_content) >= 51 and int(nitrogen_content) <= 100:
        nitrogen_level = 'not to less but also not to high'
    elif int(nitrogen_content) >= 101:
        nitrogen_level = 'high'

    # Here I have divided the phosphorus values into three categories.
    if int(phosphorus_content) >= 1 and int(phosphorus_content) <= 50:
        phosphorus_level = 'less'
    elif int(phosphorus_content) >= 51 and int(phosphorus_content) <= 100:
        phosphorus_level = 'not to less but also not to high'
    elif int(phosphorus_content) >= 101:
        phosphorus_level = 'high'

    # Here I have divided the potassium values into three categories.
    if int(potassium_content) >= 1 and int(potassium_content) <= 50:
        potassium_level = 'less'
    elif int(potassium_content) >= 51 and int(potassium_content) <= 100:
        potassium_level = 'not to less but also not to high'
    elif int(potassium_content) >= 101:
        potassium_level = 'high'

    # Here I have divided the ph values into three categories.
    if float(ph_content) >= 0 and float(ph_content) <= 5:
        phlevel = 'acidic'
    elif float(ph_content) >= 6 and float(ph_content) <= 8:
        phlevel = 'neutral'
    elif float(ph_content) >= 9 and float(ph_content) <= 14:
        phlevel = 'alkaline'

    print(crop_name)
    print(humidity_level)
    print(temperature_level)
    print(rainfall_level)
    print(nitrogen_level)
    print(phosphorus_level)
    print(potassium_level)
    print(phlevel)

    return ({
            "crop_name": crop_name,
            "humidity_level": humidity_level,
            "temperature_level": temperature_level,
            "rainfall_level": rainfall_level,
            "nitrogen_level": nitrogen_level,
            "phosphorus_level": phosphorus_level,
            "potassium_level": potassium_level,
            "phlevel": phlevel
            })





















def determine_flood_probability(weather_data: Dict[str, Any]) -> str:
    precip_intensity = weather_data.get("precipIntensity", 0)
    humidity = weather_data.get("humidity", 0)
    cloud_cover = weather_data.get("cloudCover", 0)
    wind_speed = weather_data.get("windSpeed", 0)
    visibility = weather_data.get("visibility", float('inf'))

    flood_risk = "Low"

    if precip_intensity > 0.5:
        flood_risk = "High"
    elif precip_intensity > 0.1:
        flood_risk = "Low"

    if humidity > 80:
        flood_risk = "High" if flood_risk != "Low" else "Low"
    elif humidity > 60:
        flood_risk = "Low" if flood_risk != "Low" else "Low"

    if cloud_cover > 0.8:
        flood_risk = "High" if flood_risk != "Low" else "Low"
    elif cloud_cover > 0.5:
        flood_risk = "Low" if flood_risk != "Low" else "Low"

    if wind_speed < 5:
        flood_risk = "Low" if flood_risk != "Low" else "Low"

    if visibility < 1:
        flood_risk = "High" if flood_risk != "Low" else "Low"
        
        
            # Suggest crops based on flood risk
    if flood_risk == "High":
        suggested_crops = ["Rice", "Taro", "Sugarcane", "Jute", "Water spinach"]
    elif flood_risk == "Low":
        suggested_crops = ["Sorghum", "Pearl millet", "Cowpea", "Pigeon pea", "Sunflower"]
    else:  # Low flood risk (drought conditions)
        suggested_crops = ["Millet", "Teff", "Chickpea", "Quinoa", "Cassava"]

    return {
        "flood_risk": flood_risk,
        "suggested_crops": suggested_crops
    }



@app.post("/get-flood-risk")
async def get_flood_risk(location: Location):
    if not AMBEE_API_KEY:
        raise HTTPException(status_code=500, detail="API key not configured")

    url = f"https://api.ambeedata.com/weather/latest/by-lat-lng?lat={location.lat}&lng={location.lng}"
    headers = {
        "x-api-key": AMBEE_API_KEY,
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch weather data")

        weather_data = response.json()["data"]
        flood_risk = determine_flood_probability(weather_data)["flood_risk"]
        suggested_crops = determine_flood_probability(weather_data)["suggested_crops"]

        return {
            "location": {"lat": location.lat, "lng": location.lng},
            "weather_data": weather_data,
            "flood_risk": flood_risk,
            "suggested_crops": suggested_crops
        }







   
        
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)