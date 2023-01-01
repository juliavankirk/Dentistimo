import { Api } from './Api'
import axios, { AxiosError, AxiosResponse } from 'axios';
import AppointmentType from '../Types/AppointmentType';

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

export const appointmentApi = {
  getAppointments: (clinicId : number) => {
    Api.get(`/clinics/${clinicId}/appointments`);
  },
  makeAppointment: async <T>(data: AppointmentType) => {
    return await Api.post<T>(`/appointments`, data);
  }
}