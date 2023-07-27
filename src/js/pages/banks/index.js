import '../../../scss/components/_currencies.scss';
import { getToken } from '../../store/index.js';
import { myFetch } from '../../request.js';
import { get } from '../../utils/index';
import ymaps from 'ymaps';
import { showPreloader } from '../../components/common';
import { main } from '../../components/container';
import { getSection } from '../currencies/dom';
import { headerNav } from '../../components/header';
import { mount } from 'redom';

const title = 'Карта банкоматов';

const preloadBanksPage = () => {
  document.title = title;
  headerNav.style.display = 'display: block';
  get('#banks-link').classList.add('active');
  showPreloader(main, true);
};

const renderYaMap = (payload) => {
  ymaps
    .load()
    .then((maps) => {
      const map = new maps.Map('ya-map', {
        center: [55.76029, 37.618645], // Москва (Большой театр)
        zoom: 11,
      });

      payload.forEach((obj) => {
        map.geoObjects.add(new maps.Placemark([obj.lat, obj.lon]));
      });
    })
    .catch((error) => console.log('Не удалось загрузить Яндекс Карты', error));

  get('#ya-map').style.cssText = 'height: 728px';
};

export default async () => {
  preloadBanksPage();

  myFetch(
    'banks',
    {
      method: 'GET',
      headers: new Headers({
        Authorization: 'Basic ' + getToken(),
      }),
    },
    (payload) => {
      main.innerHTML = '';
      mount(main, getSection(title));

      renderYaMap(payload);
    }
  );
};
