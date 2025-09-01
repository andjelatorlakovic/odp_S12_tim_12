import axios from 'axios';
import type { ApiResponseKviz, ApiResponseKvizList, ApiResponseDelete } from '../../types/quiz/ApiResponseQuiz';

const BASE_URL: string = import.meta.env.VITE_API_URL;

// API rute
const API_URL_ALL = BASE_URL + "kviz";
const API_URL_ADD = BASE_URL + "kviz";
const API_URL_GET_ID = (id: number) => BASE_URL + `kvizId?id=${id}`;
const API_URL_GET_NAZ_JEZ_NIV = BASE_URL + "kvizPretraga";
const API_URL_FILTER = BASE_URL + "kvizFilter";
const API_URL_DELETE = (id: number) => BASE_URL + `kvizObrisi?id=${id}`;

const getToken = () => localStorage.getItem('authToken');

export const kvizApi = {
  async dobaviSveKvizove(): Promise<ApiResponseKvizList> {
    try {
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get<ApiResponseKvizList>(API_URL_ALL, config);
      return res.data;
    } catch (error) {
      let message = "Greška pri dohvatanju svih kvizova.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return { success: false, message, data: [] };
    }
  },

  async kreirajKviz(naziv_kviza: string, jezik: string, nivo_znanja: string): Promise<ApiResponseKviz> {
    try {
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.post<ApiResponseKviz>(
        API_URL_ADD,
        { naziv_kviza, jezik, nivo_znanja },
        config
      );
      return res.data;
    } catch (error) {
      let message = "Greška pri kreiranju kviza.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return { success: false, message, data: null };
    }
  },

  async dobaviKvizPoId(id: number): Promise<ApiResponseKviz> {
    try {
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get<ApiResponseKviz>(API_URL_GET_ID(id), config);
      return res.data;
    } catch (error) {
      let message = "Greška pri dohvatanju kviza po ID.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return { success: false, message, data: null };
    }
  },

  async dobaviKvizPoNazivJezikNivo(naziv_kviza: string, jezik: string, nivo_znanja: string): Promise<ApiResponseKviz> {
    try {
      const token = getToken();
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` }, params: { naziv_kviza, jezik, nivo_znanja } }
        : { params: { naziv_kviza, jezik, nivo_znanja } };
      const res = await axios.get<ApiResponseKviz>(API_URL_GET_NAZ_JEZ_NIV, config);
      return res.data;
    } catch (error) {
      let message = "Greška pri dohvatanju kviza po naziv-jezik-nivo.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return { success: false, message, data: null };
    }
  },

  async dobaviKvizovePoJezikuINivou(jezik: string, nivo_znanja: string): Promise<ApiResponseKvizList> {
    try {
      const token = getToken();
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` }, params: { jezik, nivo_znanja } }
        : { params: { jezik, nivo_znanja } };
      const res = await axios.get<ApiResponseKvizList>(API_URL_FILTER, config);
      return res.data;
    } catch (error) {
      let message = "Greška pri filtriranju kvizova po jeziku i nivou.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return { success: false, message, data: [] };
    }
  },

  async obrisiKviz(id: number): Promise<ApiResponseDelete> {
    try {
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.delete<ApiResponseDelete>(API_URL_DELETE(id), config);
      return res.data;
    } catch (error) {
      let message = "Greška pri brisanju kviza.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return { success: false, message };
    }
  },
};
