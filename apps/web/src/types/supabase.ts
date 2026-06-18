export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      articulos: {
        Row: {
          codigo: string
          codigo_cup: string | null
          created_at: string
          descripcion: string | null
          estado: string | null
          grupo: string | null
          id: string
          linea: string | null
          updated_at: string
        }
        Insert: {
          codigo: string
          codigo_cup?: string | null
          created_at?: string
          descripcion?: string | null
          estado?: string | null
          grupo?: string | null
          id?: string
          linea?: string | null
          updated_at?: string
        }
        Update: {
          codigo?: string
          codigo_cup?: string | null
          created_at?: string
          descripcion?: string | null
          estado?: string | null
          grupo?: string | null
          id?: string
          linea?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          accion: string
          created_at: string
          datos_antes: Json | null
          datos_despues: Json | null
          entidad: string
          id: number
          ip_address: unknown
          registro_id: string | null
          sede_id: string | null
          user_agent: string | null
          usuario_id: string | null
        }
        Insert: {
          accion: string
          created_at?: string
          datos_antes?: Json | null
          datos_despues?: Json | null
          entidad: string
          id?: number
          ip_address?: unknown
          registro_id?: string | null
          sede_id?: string | null
          user_agent?: string | null
          usuario_id?: string | null
        }
        Update: {
          accion?: string
          created_at?: string
          datos_antes?: Json | null
          datos_despues?: Json | null
          entidad?: string
          id?: number
          ip_address?: unknown
          registro_id?: string | null
          sede_id?: string | null
          user_agent?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_sede_id_fkey"
            columns: ["sede_id"]
            isOneToOne: false
            referencedRelation: "sedes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      calendario_festivos: {
        Row: {
          anio: number
          descripcion: string | null
          fecha: string
          id: string
        }
        Insert: {
          anio: number
          descripcion?: string | null
          fecha: string
          id?: string
        }
        Update: {
          anio?: number
          descripcion?: string | null
          fecha?: string
          id?: string
        }
        Relationships: []
      }
      citas: {
        Row: {
          color: string | null
          created_at: string
          estado: string
          fecha_fin: string
          fecha_inicio: string
          id: string
          observaciones: string | null
          paciente_id: string
          profesional_id: string
          sede_id: string
          tipo_consulta: string | null
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          estado?: string
          fecha_fin: string
          fecha_inicio: string
          id?: string
          observaciones?: string | null
          paciente_id: string
          profesional_id: string
          sede_id: string
          tipo_consulta?: string | null
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          estado?: string
          fecha_fin?: string
          fecha_inicio?: string
          id?: string
          observaciones?: string | null
          paciente_id?: string
          profesional_id?: string
          sede_id?: string
          tipo_consulta?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "citas_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "citas_profesional_id_fkey"
            columns: ["profesional_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "citas_sede_id_fkey"
            columns: ["sede_id"]
            isOneToOne: false
            referencedRelation: "sedes"
            referencedColumns: ["id"]
          },
        ]
      }
      contratos: {
        Row: {
          activo: boolean
          created_at: string
          entidad_id: string
          fecha_final: string
          fecha_inicial: string
          id: string
          numero: string
          regimen: string | null
          updated_at: string
          valor: number | null
        }
        Insert: {
          activo?: boolean
          created_at?: string
          entidad_id: string
          fecha_final: string
          fecha_inicial: string
          id?: string
          numero: string
          regimen?: string | null
          updated_at?: string
          valor?: number | null
        }
        Update: {
          activo?: boolean
          created_at?: string
          entidad_id?: string
          fecha_final?: string
          fecha_inicial?: string
          id?: string
          numero?: string
          regimen?: string | null
          updated_at?: string
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contratos_entidad_id_fkey"
            columns: ["entidad_id"]
            isOneToOne: false
            referencedRelation: "entidades"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos: {
        Row: {
          archivo_url: string
          created_at: string
          entidad_id: string | null
          id: string
          nombre: string
          paciente_id: string | null
          tipo: string
        }
        Insert: {
          archivo_url: string
          created_at?: string
          entidad_id?: string | null
          id?: string
          nombre: string
          paciente_id?: string | null
          tipo: string
        }
        Update: {
          archivo_url?: string
          created_at?: string
          entidad_id?: string | null
          id?: string
          nombre?: string
          paciente_id?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_entidad_id_fkey"
            columns: ["entidad_id"]
            isOneToOne: false
            referencedRelation: "entidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      entidades: {
        Row: {
          activo: boolean
          ciudad: string | null
          codigo: string
          created_at: string
          direccion: string | null
          email: string | null
          id: string
          nit: string
          nombre: string
          telefono: string | null
          unidad: string | null
          updated_at: string
        }
        Insert: {
          activo?: boolean
          ciudad?: string | null
          codigo: string
          created_at?: string
          direccion?: string | null
          email?: string | null
          id?: string
          nit: string
          nombre: string
          telefono?: string | null
          unidad?: string | null
          updated_at?: string
        }
        Update: {
          activo?: boolean
          ciudad?: string | null
          codigo?: string
          created_at?: string
          direccion?: string | null
          email?: string | null
          id?: string
          nit?: string
          nombre?: string
          telefono?: string | null
          unidad?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      firmas: {
        Row: {
          created_at: string
          id: string
          imagen_url: string
          profesional_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          imagen_url: string
          profesional_id: string
        }
        Update: {
          created_at?: string
          id?: string
          imagen_url?: string
          profesional_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "firmas_profesional_id_fkey"
            columns: ["profesional_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      h_apertura: {
        Row: {
          analisis: string | null
          antecedentes: string | null
          ayudas_diagnosticas: string | null
          created_at: string
          enfermedad_actual: string | null
          examen_fisico: Json | null
          historia_id: string
          id: string
          motivo_consulta: string | null
          plan_manejo: string | null
          recomendaciones: string | null
          revision_sistemas: Json | null
          updated_at: string
        }
        Insert: {
          analisis?: string | null
          antecedentes?: string | null
          ayudas_diagnosticas?: string | null
          created_at?: string
          enfermedad_actual?: string | null
          examen_fisico?: Json | null
          historia_id: string
          id?: string
          motivo_consulta?: string | null
          plan_manejo?: string | null
          recomendaciones?: string | null
          revision_sistemas?: Json | null
          updated_at?: string
        }
        Update: {
          analisis?: string | null
          antecedentes?: string | null
          ayudas_diagnosticas?: string | null
          created_at?: string
          enfermedad_actual?: string | null
          examen_fisico?: Json | null
          historia_id?: string
          id?: string
          motivo_consulta?: string | null
          plan_manejo?: string | null
          recomendaciones?: string | null
          revision_sistemas?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "h_apertura_historia_id_fkey"
            columns: ["historia_id"]
            isOneToOne: true
            referencedRelation: "historias"
            referencedColumns: ["id"]
          },
        ]
      }
      h_enfermeria: {
        Row: {
          created_at: string
          diagnostico_enfermero: string | null
          evolucion: string | null
          historia_id: string
          id: string
          intervenciones: string | null
          observaciones: string | null
          updated_at: string
          valoracion: string | null
        }
        Insert: {
          created_at?: string
          diagnostico_enfermero?: string | null
          evolucion?: string | null
          historia_id: string
          id?: string
          intervenciones?: string | null
          observaciones?: string | null
          updated_at?: string
          valoracion?: string | null
        }
        Update: {
          created_at?: string
          diagnostico_enfermero?: string | null
          evolucion?: string | null
          historia_id?: string
          id?: string
          intervenciones?: string | null
          observaciones?: string | null
          updated_at?: string
          valoracion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "h_enfermeria_historia_id_fkey"
            columns: ["historia_id"]
            isOneToOne: true
            referencedRelation: "historias"
            referencedColumns: ["id"]
          },
        ]
      }
      h_epicrisis: {
        Row: {
          created_at: string
          destino_paciente: string | null
          evolucion: string | null
          hallazgos_relevantes: string | null
          historia_id: string
          id: string
          procedimientos_realizados: string | null
          recomendaciones: string | null
          resumen_ingreso: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          destino_paciente?: string | null
          evolucion?: string | null
          hallazgos_relevantes?: string | null
          historia_id: string
          id?: string
          procedimientos_realizados?: string | null
          recomendaciones?: string | null
          resumen_ingreso?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          destino_paciente?: string | null
          evolucion?: string | null
          hallazgos_relevantes?: string | null
          historia_id?: string
          id?: string
          procedimientos_realizados?: string | null
          recomendaciones?: string | null
          resumen_ingreso?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "h_epicrisis_historia_id_fkey"
            columns: ["historia_id"]
            isOneToOne: true
            referencedRelation: "historias"
            referencedColumns: ["id"]
          },
        ]
      }
      h_evol_control: {
        Row: {
          analisis: string | null
          created_at: string
          historia_id: string
          id: string
          objetivo: Json | null
          plan: string | null
          subjetivo: string | null
          updated_at: string
        }
        Insert: {
          analisis?: string | null
          created_at?: string
          historia_id: string
          id?: string
          objetivo?: Json | null
          plan?: string | null
          subjetivo?: string | null
          updated_at?: string
        }
        Update: {
          analisis?: string | null
          created_at?: string
          historia_id?: string
          id?: string
          objetivo?: Json | null
          plan?: string | null
          subjetivo?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "h_evol_control_historia_id_fkey"
            columns: ["historia_id"]
            isOneToOne: true
            referencedRelation: "historias"
            referencedColumns: ["id"]
          },
        ]
      }
      h_evolucion: {
        Row: {
          analisis: string | null
          created_at: string
          historia_id: string
          id: string
          objetivo: Json | null
          plan: string | null
          subjetivo: string | null
          updated_at: string
        }
        Insert: {
          analisis?: string | null
          created_at?: string
          historia_id: string
          id?: string
          objetivo?: Json | null
          plan?: string | null
          subjetivo?: string | null
          updated_at?: string
        }
        Update: {
          analisis?: string | null
          created_at?: string
          historia_id?: string
          id?: string
          objetivo?: Json | null
          plan?: string | null
          subjetivo?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "h_evolucion_historia_id_fkey"
            columns: ["historia_id"]
            isOneToOne: true
            referencedRelation: "historias"
            referencedColumns: ["id"]
          },
        ]
      }
      h_gerontologia: {
        Row: {
          created_at: string
          diagnostico: string | null
          historia_id: string
          id: string
          observaciones: string | null
          plan_cuidado: string | null
          updated_at: string
          valoracion_geriatrica: Json | null
        }
        Insert: {
          created_at?: string
          diagnostico?: string | null
          historia_id: string
          id?: string
          observaciones?: string | null
          plan_cuidado?: string | null
          updated_at?: string
          valoracion_geriatrica?: Json | null
        }
        Update: {
          created_at?: string
          diagnostico?: string | null
          historia_id?: string
          id?: string
          observaciones?: string | null
          plan_cuidado?: string | null
          updated_at?: string
          valoracion_geriatrica?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "h_gerontologia_historia_id_fkey"
            columns: ["historia_id"]
            isOneToOne: true
            referencedRelation: "historias"
            referencedColumns: ["id"]
          },
        ]
      }
      h_nutricion: {
        Row: {
          created_at: string
          diagnostico: string | null
          historia_id: string
          id: string
          plan_nutricional: string | null
          recomendaciones: string | null
          updated_at: string
          valoracion_nutricional: Json | null
        }
        Insert: {
          created_at?: string
          diagnostico?: string | null
          historia_id: string
          id?: string
          plan_nutricional?: string | null
          recomendaciones?: string | null
          updated_at?: string
          valoracion_nutricional?: Json | null
        }
        Update: {
          created_at?: string
          diagnostico?: string | null
          historia_id?: string
          id?: string
          plan_nutricional?: string | null
          recomendaciones?: string | null
          updated_at?: string
          valoracion_nutricional?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "h_nutricion_historia_id_fkey"
            columns: ["historia_id"]
            isOneToOne: true
            referencedRelation: "historias"
            referencedColumns: ["id"]
          },
        ]
      }
      h_psicologia: {
        Row: {
          created_at: string
          diagnostico: string | null
          evaluacion: string | null
          historia_id: string
          id: string
          plan_terapeutico: string | null
          pruebas_aplicadas: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          diagnostico?: string | null
          evaluacion?: string | null
          historia_id: string
          id?: string
          plan_terapeutico?: string | null
          pruebas_aplicadas?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          diagnostico?: string | null
          evaluacion?: string | null
          historia_id?: string
          id?: string
          plan_terapeutico?: string | null
          pruebas_aplicadas?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "h_psicologia_historia_id_fkey"
            columns: ["historia_id"]
            isOneToOne: true
            referencedRelation: "historias"
            referencedColumns: ["id"]
          },
        ]
      }
      h_terapia: {
        Row: {
          created_at: string
          disciplina: string
          evolucion: string | null
          fase: string
          historia_id: string
          id: string
          objetivo: string | null
          recomendaciones: string | null
          tratamiento: string | null
          updated_at: string
          valoracion: string | null
        }
        Insert: {
          created_at?: string
          disciplina: string
          evolucion?: string | null
          fase: string
          historia_id: string
          id?: string
          objetivo?: string | null
          recomendaciones?: string | null
          tratamiento?: string | null
          updated_at?: string
          valoracion?: string | null
        }
        Update: {
          created_at?: string
          disciplina?: string
          evolucion?: string | null
          fase?: string
          historia_id?: string
          id?: string
          objetivo?: string | null
          recomendaciones?: string | null
          tratamiento?: string | null
          updated_at?: string
          valoracion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "h_terapia_historia_id_fkey"
            columns: ["historia_id"]
            isOneToOne: true
            referencedRelation: "historias"
            referencedColumns: ["id"]
          },
        ]
      }
      h_trabajo_social: {
        Row: {
          created_at: string
          diagnostico_social: string | null
          evaluacion_social: Json | null
          historia_id: string
          id: string
          intervencion: string | null
          seguimiento: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          diagnostico_social?: string | null
          evaluacion_social?: Json | null
          historia_id: string
          id?: string
          intervencion?: string | null
          seguimiento?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          diagnostico_social?: string | null
          evaluacion_social?: Json | null
          historia_id?: string
          id?: string
          intervencion?: string | null
          seguimiento?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "h_trabajo_social_historia_id_fkey"
            columns: ["historia_id"]
            isOneToOne: true
            referencedRelation: "historias"
            referencedColumns: ["id"]
          },
        ]
      }
      historias: {
        Row: {
          created_at: string
          estado: string
          fecha_atencion: string
          id: string
          medio: string | null
          paciente_id: string
          periodo_anio: number
          periodo_mes: number
          profesional_id: string
          sede_id: string
          tipo_consulta: string | null
          tipo_historia_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          estado?: string
          fecha_atencion?: string
          id?: string
          medio?: string | null
          paciente_id: string
          periodo_anio: number
          periodo_mes: number
          profesional_id: string
          sede_id: string
          tipo_consulta?: string | null
          tipo_historia_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          estado?: string
          fecha_atencion?: string
          id?: string
          medio?: string | null
          paciente_id?: string
          periodo_anio?: number
          periodo_mes?: number
          profesional_id?: string
          sede_id?: string
          tipo_consulta?: string | null
          tipo_historia_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "historias_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historias_profesional_id_fkey"
            columns: ["profesional_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historias_sede_id_fkey"
            columns: ["sede_id"]
            isOneToOne: false
            referencedRelation: "sedes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historias_tipo_historia_id_fkey"
            columns: ["tipo_historia_id"]
            isOneToOne: false
            referencedRelation: "tipos_historia"
            referencedColumns: ["id"]
          },
        ]
      }
      infografias: {
        Row: {
          activo: boolean
          archivo_url: string
          created_at: string
          descripcion: string | null
          id: string
          titulo: string
        }
        Insert: {
          activo?: boolean
          archivo_url: string
          created_at?: string
          descripcion?: string | null
          id?: string
          titulo: string
        }
        Update: {
          activo?: boolean
          archivo_url?: string
          created_at?: string
          descripcion?: string | null
          id?: string
          titulo?: string
        }
        Relationships: []
      }
      paciente_cuidadores: {
        Row: {
          created_at: string
          estado_civil: string | null
          id: string
          nombre: string
          paciente_id: string
          parentesco: string | null
          telefono: string | null
        }
        Insert: {
          created_at?: string
          estado_civil?: string | null
          id?: string
          nombre: string
          paciente_id: string
          parentesco?: string | null
          telefono?: string | null
        }
        Update: {
          created_at?: string
          estado_civil?: string | null
          id?: string
          nombre?: string
          paciente_id?: string
          parentesco?: string | null
          telefono?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paciente_cuidadores_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      paciente_diagnosticos: {
        Row: {
          codigo_cie10: string
          created_at: string
          descripcion: string | null
          id: string
          paciente_id: string
          riesgo_hemodinamico: boolean | null
          riesgo_vital: boolean | null
          tipo: string | null
        }
        Insert: {
          codigo_cie10: string
          created_at?: string
          descripcion?: string | null
          id?: string
          paciente_id: string
          riesgo_hemodinamico?: boolean | null
          riesgo_vital?: boolean | null
          tipo?: string | null
        }
        Update: {
          codigo_cie10?: string
          created_at?: string
          descripcion?: string | null
          id?: string
          paciente_id?: string
          riesgo_hemodinamico?: boolean | null
          riesgo_vital?: boolean | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paciente_diagnosticos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      paciente_vivienda: {
        Row: {
          banos: number | null
          cocina: string | null
          created_at: string
          estrato: number | null
          habitaciones: number | null
          id: string
          observaciones: string | null
          paciente_id: string
          pisos: number | null
          servicios_publicos: string[] | null
          tipo_vivienda: string | null
          updated_at: string
        }
        Insert: {
          banos?: number | null
          cocina?: string | null
          created_at?: string
          estrato?: number | null
          habitaciones?: number | null
          id?: string
          observaciones?: string | null
          paciente_id: string
          pisos?: number | null
          servicios_publicos?: string[] | null
          tipo_vivienda?: string | null
          updated_at?: string
        }
        Update: {
          banos?: number | null
          cocina?: string | null
          created_at?: string
          estrato?: number | null
          habitaciones?: number | null
          id?: string
          observaciones?: string | null
          paciente_id?: string
          pisos?: number | null
          servicios_publicos?: string[] | null
          tipo_vivienda?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "paciente_vivienda_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: true
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      pacientes: {
        Row: {
          aceptado: boolean | null
          alto_riesgo: boolean
          apellidos: string
          barrio: string | null
          ciudad_atencion: string | null
          ciudad_visita: string | null
          comuna: string | null
          created_at: string
          direccion: string | null
          email: string | null
          entidad_id: string | null
          estado: string
          estado_civil: string | null
          etnia: string | null
          fecha_estado: string | null
          fecha_ingreso: string | null
          fecha_nacimiento: string
          id: string
          identidad: string
          medico_tratante: string | null
          nivel_educativo: string | null
          nombres: string
          periodo_visitas: string | null
          religion: string | null
          responsable_nombre: string | null
          responsable_telefono: string | null
          rh: string | null
          sede_id: string
          sexo: string
          telefono_fijo: string | null
          telefono_movil: string | null
          tipo_identidad: string
          tipo_inmueble: string | null
          tipo_paciente: string | null
          tipo_usuario: string | null
          tipo_via: string | null
          updated_at: string
        }
        Insert: {
          aceptado?: boolean | null
          alto_riesgo?: boolean
          apellidos: string
          barrio?: string | null
          ciudad_atencion?: string | null
          ciudad_visita?: string | null
          comuna?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          entidad_id?: string | null
          estado?: string
          estado_civil?: string | null
          etnia?: string | null
          fecha_estado?: string | null
          fecha_ingreso?: string | null
          fecha_nacimiento: string
          id?: string
          identidad: string
          medico_tratante?: string | null
          nivel_educativo?: string | null
          nombres: string
          periodo_visitas?: string | null
          religion?: string | null
          responsable_nombre?: string | null
          responsable_telefono?: string | null
          rh?: string | null
          sede_id: string
          sexo: string
          telefono_fijo?: string | null
          telefono_movil?: string | null
          tipo_identidad?: string
          tipo_inmueble?: string | null
          tipo_paciente?: string | null
          tipo_usuario?: string | null
          tipo_via?: string | null
          updated_at?: string
        }
        Update: {
          aceptado?: boolean | null
          alto_riesgo?: boolean
          apellidos?: string
          barrio?: string | null
          ciudad_atencion?: string | null
          ciudad_visita?: string | null
          comuna?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          entidad_id?: string | null
          estado?: string
          estado_civil?: string | null
          etnia?: string | null
          fecha_estado?: string | null
          fecha_ingreso?: string | null
          fecha_nacimiento?: string
          id?: string
          identidad?: string
          medico_tratante?: string | null
          nivel_educativo?: string | null
          nombres?: string
          periodo_visitas?: string | null
          religion?: string | null
          responsable_nombre?: string | null
          responsable_telefono?: string | null
          rh?: string | null
          sede_id?: string
          sexo?: string
          telefono_fijo?: string | null
          telefono_movil?: string | null
          tipo_identidad?: string
          tipo_inmueble?: string | null
          tipo_paciente?: string | null
          tipo_usuario?: string | null
          tipo_via?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pacientes_entidad_id_fkey"
            columns: ["entidad_id"]
            isOneToOne: false
            referencedRelation: "entidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pacientes_sede_id_fkey"
            columns: ["sede_id"]
            isOneToOne: false
            referencedRelation: "sedes"
            referencedColumns: ["id"]
          },
        ]
      }
      perfiles: {
        Row: {
          activo: boolean
          apellidos: string
          cedula: string
          color_agenda: string | null
          created_at: string
          especialidad: string | null
          id: string
          nombres: string
          registro_medico: string | null
          sede_activa_id: string | null
          telefono: string | null
          updated_at: string
        }
        Insert: {
          activo?: boolean
          apellidos: string
          cedula: string
          color_agenda?: string | null
          created_at?: string
          especialidad?: string | null
          id: string
          nombres: string
          registro_medico?: string | null
          sede_activa_id?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          activo?: boolean
          apellidos?: string
          cedula?: string
          color_agenda?: string | null
          created_at?: string
          especialidad?: string | null
          id?: string
          nombres?: string
          registro_medico?: string | null
          sede_activa_id?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "perfiles_sede_activa_id_fkey"
            columns: ["sede_activa_id"]
            isOneToOne: false
            referencedRelation: "sedes"
            referencedColumns: ["id"]
          },
        ]
      }
      permisos: {
        Row: {
          codigo: string
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
        }
        Insert: {
          codigo: string
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
        }
        Update: {
          codigo?: string
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      programacion_items: {
        Row: {
          articulo_id: string | null
          cantidad: number
          created_at: string
          descripcion: string | null
          id: string
          programacion_id: string
        }
        Insert: {
          articulo_id?: string | null
          cantidad?: number
          created_at?: string
          descripcion?: string | null
          id?: string
          programacion_id: string
        }
        Update: {
          articulo_id?: string | null
          cantidad?: number
          created_at?: string
          descripcion?: string | null
          id?: string
          programacion_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "programacion_items_articulo_id_fkey"
            columns: ["articulo_id"]
            isOneToOne: false
            referencedRelation: "articulos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programacion_items_programacion_id_fkey"
            columns: ["programacion_id"]
            isOneToOne: false
            referencedRelation: "programacion_servicios"
            referencedColumns: ["id"]
          },
        ]
      }
      programacion_servicios: {
        Row: {
          cantidad: number
          created_at: string
          fecha_autorizacion: string | null
          fecha_vencimiento: string | null
          id: string
          numero_autorizacion: string | null
          paciente_id: string
          periodicidad: string | null
          periodo_anio: number
          periodo_mes: number
          sede_id: string
          servicio_id: string
          tarifa: number | null
          updated_at: string
        }
        Insert: {
          cantidad?: number
          created_at?: string
          fecha_autorizacion?: string | null
          fecha_vencimiento?: string | null
          id?: string
          numero_autorizacion?: string | null
          paciente_id: string
          periodicidad?: string | null
          periodo_anio: number
          periodo_mes: number
          sede_id: string
          servicio_id: string
          tarifa?: number | null
          updated_at?: string
        }
        Update: {
          cantidad?: number
          created_at?: string
          fecha_autorizacion?: string | null
          fecha_vencimiento?: string | null
          id?: string
          numero_autorizacion?: string | null
          paciente_id?: string
          periodicidad?: string | null
          periodo_anio?: number
          periodo_mes?: number
          sede_id?: string
          servicio_id?: string
          tarifa?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "programacion_servicios_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programacion_servicios_sede_id_fkey"
            columns: ["sede_id"]
            isOneToOne: false
            referencedRelation: "sedes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programacion_servicios_servicio_id_fkey"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "servicios_catalogo"
            referencedColumns: ["id"]
          },
        ]
      }
      rol_permisos: {
        Row: {
          permiso_id: string
          rol_id: string
        }
        Insert: {
          permiso_id: string
          rol_id: string
        }
        Update: {
          permiso_id?: string
          rol_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rol_permisos_permiso_id_fkey"
            columns: ["permiso_id"]
            isOneToOne: false
            referencedRelation: "permisos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rol_permisos_rol_id_fkey"
            columns: ["rol_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          activo: boolean
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      sedes: {
        Row: {
          activo: boolean
          ciudad: string
          codigo: string
          created_at: string
          direccion: string | null
          id: string
          nombre: string
          telefonos: string | null
          updated_at: string
        }
        Insert: {
          activo?: boolean
          ciudad: string
          codigo: string
          created_at?: string
          direccion?: string | null
          id?: string
          nombre: string
          telefonos?: string | null
          updated_at?: string
        }
        Update: {
          activo?: boolean
          ciudad?: string
          codigo?: string
          created_at?: string
          direccion?: string | null
          id?: string
          nombre?: string
          telefonos?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      servicios_catalogo: {
        Row: {
          activo: boolean
          cod_facturacion: string | null
          codigo_cups: string
          created_at: string
          id: string
          nombre: string
          tipo: string
          updated_at: string
          valor: number | null
          valor_rural_prof: number | null
          valor_urbano_prof: number | null
        }
        Insert: {
          activo?: boolean
          cod_facturacion?: string | null
          codigo_cups: string
          created_at?: string
          id?: string
          nombre: string
          tipo: string
          updated_at?: string
          valor?: number | null
          valor_rural_prof?: number | null
          valor_urbano_prof?: number | null
        }
        Update: {
          activo?: boolean
          cod_facturacion?: string | null
          codigo_cups?: string
          created_at?: string
          id?: string
          nombre?: string
          tipo?: string
          updated_at?: string
          valor?: number | null
          valor_rural_prof?: number | null
          valor_urbano_prof?: number | null
        }
        Relationships: []
      }
      tablas_param: {
        Row: {
          activo: boolean
          codigo: string | null
          created_at: string
          id: string
          nombre: string
          tipo: string
          valor: string | null
        }
        Insert: {
          activo?: boolean
          codigo?: string | null
          created_at?: string
          id?: string
          nombre: string
          tipo: string
          valor?: string | null
        }
        Update: {
          activo?: boolean
          codigo?: string | null
          created_at?: string
          id?: string
          nombre?: string
          tipo?: string
          valor?: string | null
        }
        Relationships: []
      }
      tipos_historia: {
        Row: {
          activo: boolean
          codigo: string
          id: string
          nombre: string
          tiene_apertura: boolean | null
          tiene_evolucion: boolean | null
        }
        Insert: {
          activo?: boolean
          codigo: string
          id?: string
          nombre: string
          tiene_apertura?: boolean | null
          tiene_evolucion?: boolean | null
        }
        Update: {
          activo?: boolean
          codigo?: string
          id?: string
          nombre?: string
          tiene_apertura?: boolean | null
          tiene_evolucion?: boolean | null
        }
        Relationships: []
      }
      usuario_roles: {
        Row: {
          rol_id: string
          sede_id: string
          usuario_id: string
        }
        Insert: {
          rol_id: string
          sede_id: string
          usuario_id: string
        }
        Update: {
          rol_id?: string
          sede_id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuario_roles_rol_id_fkey"
            columns: ["rol_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_roles_sede_id_fkey"
            columns: ["sede_id"]
            isOneToOne: false
            referencedRelation: "sedes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_roles_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      usuario_sedes: {
        Row: {
          sede_id: string
          usuario_id: string
        }
        Insert: {
          sede_id: string
          usuario_id: string
        }
        Update: {
          sede_id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuario_sedes_sede_id_fkey"
            columns: ["sede_id"]
            isOneToOne: false
            referencedRelation: "sedes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_sedes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

