export interface Propietario {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  ci: string;
  telefono: string;
}

export interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  sexo: "Macho" | "Hembra";
  fechaNacimiento: string;
  peso: number;
  propietario: Propietario;
}

export interface NuevaMascotaInput {
  nombre: string;
  especie: string;
  raza?: string;
  sexo: "Macho" | "Hembra";
  fechaNacimiento?: string;
  peso?: number;
  propietario: {
    ci: string;
    nombre?: string;
    apellidoPaterno?: string;
    telefono?: string;
  };
}
