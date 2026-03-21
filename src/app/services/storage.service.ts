import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}
  // Guardar un valor en localStorage
  set(key: string, value: any): void {
    try {
      const jsonData = JSON.stringify(value);
      localStorage.setItem(key, jsonData);
    } catch (error) {
      console.error('Error al guardar en localStorage', error);
    }
  }

  // Obtener un valor desde localStorage
  get(key: string): any | null {
    try {
      const jsonData = localStorage.getItem(key);
      return jsonData ? JSON.parse(jsonData) : null;
    } catch (error) {
      return null;
    }
  }

  // Eliminar un valor
  remove(key: string): void {
    localStorage.removeItem(key);
  }

  // Limpiar todo el localStorage
  clear(): void {
    localStorage.clear();
  }

  // Verificar si existe un valor
  exists(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}
