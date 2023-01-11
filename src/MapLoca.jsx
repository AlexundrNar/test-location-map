import React from "react";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  YMaps,
  Map,
  Placemark,
  Polygon,
  ZoomControl,
} from "@pbe/react-yandex-maps";
import "./map-loca.css";

const MapLoca = () => {
  const [mapLocation, setMapLocation] = useState([]);

  const loc = async () => {
    const response = await axios.get(
      "http://agro.energomera.ru:3060/api/field?lastChangeDate=2022-01-01T10:00:00.000&skip=0&take=100"
    );
    const mapData = response.data;
    mapData.forEach((mapItem) => {
      const parseLocationString = JSON.parse(mapItem.Location);
      mapItem.Location = parseLocationString;
    });
    setMapLocation(mapData);
  };

  useEffect(() => {
    loc();
  }, []);

  const defaultState = useMemo(
    () => ({
      center: [45.54, 42.01110180551306],
      zoom: 9,
      type: "yandex#satellite",
    }),
    []
  );

  return (
    <div className="map__container">
      <YMaps>
        <div className="map__content">
          <Map
            defaultState={defaultState}
            width="960px"
            height="720px"
            modules={["templateLayoutFactory", "layout.ImageWithContent"]}
          >
            <ZoomControl
              options={{
                position: {
                  right: 10,
                  top: 10,
                },
                size: "small",
              }}
            />

            {mapLocation.map((mapItem) => {
              return (
                <div key={mapItem.$id}>
                  <Placemark
                    geometry={mapItem.Location.Center}
                    properties={{
                      iconContent: mapItem.Name,
                    }}
                    options={{
                      iconLayout: "default#imageWithContent",
                      iconImageHref: "../images/icon.png",
                      iconImageSize: [37, 28],
                      iconImageOffset: [-15, -15],
                      iconContentOffset: [4, 7],
                    }}
                  />

                  <Polygon
                    geometry={[mapItem.Location.Polygon]}
                    options={{
                      fill: false,
                      strokeColor: "#fff",
                      strokeWidth: 2,
                      strokeStyle: "solid",
                    }}
                  />
                </div>
              );
            })}
          </Map>
        </div>
      </YMaps>
    </div>
  );
};

export default MapLoca;
