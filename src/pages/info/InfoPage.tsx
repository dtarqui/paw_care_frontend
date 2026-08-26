import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarDays,
  FileBarChart,
  HelpCircle,
  LogIn,
  MessageCircle,
  Package,
  PawPrint,
  Settings,
  ShieldPlus,
  Stethoscope,
  User,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";
import { Callout, Faq, FlowDiagram, RoleMatrix, Section, StateFlow, Steps } from "./InfoBlocks";

/** Índice lateral. Cada entrada apunta al `id` de su sección. */
const TOC = [
  { id: "primeros-pasos", label: "Primeros pasos" },
  { id: "roles", label: "Qué hace cada rol" },
  { id: "flujo", label: "El día a día" },
  { id: "clientes", label: "Clientes y mascotas" },
  { id: "agenda", label: "Agenda" },
  { id: "atencion", label: "Atención médica" },
  { id: "preventivo", label: "Vacunas y desparasitación" },
  { id: "cobros", label: "Cobros" },
  { id: "recordatorios", label: "Recordatorios" },
  { id: "inventario", label: "Inventario" },
  { id: "reportes", label: "Reportes" },
  { id: "usuarios", label: "Cuentas del personal" },
  { id: "cuenta", label: "Tu cuenta" },
  { id: "faq", label: "Preguntas frecuentes" },
];

export function InfoPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Información</h1>
        <p className="text-muted-foreground">
          Manual de uso de PawCare — qué hace cada pantalla y cómo resolver las tareas del día.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Índice: fijo al costado en pantallas grandes, plegado arriba en el resto */}
        <nav className="lg:sticky lg:top-6 lg:w-56 lg:shrink-0" aria-label="Índice del manual">
          <details className="rounded-lg border" open>
            <summary className="cursor-pointer px-3 py-2 text-sm font-medium lg:hidden">Índice</summary>
            <ol className="flex flex-col p-2 lg:p-2">
              {TOC.map((item, index) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="flex items-baseline gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <span className="w-4 shrink-0 text-right text-xs tabular-nums opacity-60">{index + 1}</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </details>
        </nav>

        <Card className="min-w-0 flex-1">
          <CardContent className="flex flex-col gap-8 py-6">
            {/* ------------------------------------------------------------ */}
            <Section
              id="primeros-pasos"
              icon={LogIn}
              title="Primeros pasos"
              intro="Cómo entrar y ubicarte en el sistema."
            >
              <Steps
                items={[
                  {
                    title: "Inicia sesión con el usuario que te dieron",
                    description:
                      "No es tu correo: es un nombre de usuario que asigna el Administrador de la clínica. Si te equivocas, el sistema no te dice cuál de los dos campos falló — es a propósito, por seguridad.",
                  },
                  {
                    title: "Revisa el Dashboard",
                    description:
                      "Es la primera pantalla. Arriba muestra las cifras del momento (mascotas registradas, citas de hoy, pagos pendientes) y debajo accesos directos a los módulos que te corresponden.",
                  },
                  {
                    title: "Usa el menú de la izquierda",
                    description:
                      "Está agrupado en cuatro secciones: Clientes, Clínica, Administración y Sistema. Solo ves los módulos de tu rol. En celular el menú se abre con el botón de las tres rayas.",
                  },
                ]}
              />

              <Callout tone="tip" title="El buscador es el atajo más rápido">
                Presiona <strong>Ctrl + K</strong> (o <strong>⌘ + K</strong> en Mac), o el botón «Buscar…» arriba
                del menú. Escribe el nombre de una mascota, o el nombre, apellido o CI de un propietario, y te
                lleva directo a su ficha. Sirve desde cualquier pantalla y evita tener que adivinar dónde buscar.
              </Callout>

              <Callout tone="warning" title="Si olvidaste tu contraseña">
                El enlace «¿Olvidaste tu contraseña?» del login envía un correo, así que solo funciona si tu
                cuenta tiene un email registrado <em>y</em> la clínica configuró el envío de correo. Si no,
                pídele al Administrador que te la restablezca desde Usuarios: te la comunica en persona.
              </Callout>
            </Section>

            {/* ------------------------------------------------------------ */}
            <Section
              id="roles"
              icon={Users}
              title="Qué hace cada rol"
              intro="Hay tres roles. El menú te muestra únicamente los módulos que te corresponden, y el servidor rechaza cualquier pedido de información fuera de tu rol: si llegaras a una pantalla ajena, no verías datos, solo un error."
            >
              <RoleMatrix
                roles={["Administrador", "Veterinario", "Recepción"]}
                rows={[
                  { area: "Propietarios", access: [true, false, true] },
                  { area: "Mascotas", access: [true, true, true] },
                  { area: "Agenda (citas)", access: [true, true, true] },
                  { area: "Agenda (horarios)", access: [true, true, false] },
                  { area: "Atención médica", access: [true, true, false] },
                  { area: "Control preventivo", access: [true, true, false] },
                  { area: "Recordatorios", access: [true, false, true] },
                  { area: "Pagos", access: [true, false, true] },
                  { area: "Inventario", access: [true, false, false] },
                  { area: "Reportes", access: [true, false, false] },
                  { area: "Cuentas del personal", access: [true, false, false] },
                ]}
              />

              <Callout tone="info" title="La regla que más sorprende">
                Un <strong>Veterinario solo puede agendar y reprogramar citas para sí mismo</strong>. El
                Administrador y Recepción pueden hacerlo para cualquier veterinario. Lo mismo con los horarios:
                un veterinario edita el suyo, no el de sus colegas.
              </Callout>
            </Section>

            {/* ------------------------------------------------------------ */}
            <Section
              id="flujo"
              icon={CalendarDays}
              title="El día a día"
              intro="El camino habitual de un cliente que llega a la clínica, de principio a fin."
            >
              <FlowDiagram
                steps={[
                  { icon: User, label: "Cliente", caption: "Se busca por CI" },
                  { icon: PawPrint, label: "Mascota", caption: "Se registra o se elige" },
                  { icon: CalendarDays, label: "Cita", caption: "Se agenda" },
                  { icon: Stethoscope, label: "Atención", caption: "Diagnóstico y tratamiento" },
                  { icon: Wallet, label: "Cobro", caption: "Queda pendiente y se cobra" },
                ]}
              />

              <p className="text-sm text-muted-foreground">
                No hace falta seguir el camino completo: se puede atender a una mascota sin cita previa, o
                registrar una mascota hoy y agendarle recién la semana que viene. Lo único encadenado es el
                cobro — <strong>una atención registrada genera automáticamente un pago pendiente</strong>, y esa
                es la lista que ve Recepción en Pagos.
              </p>
            </Section>

            {/* ------------------------------------------------------------ */}
            <Section
              id="clientes"
              icon={PawPrint}
              title="Clientes y mascotas"
              intro="Los propietarios no se crean por separado: nacen al registrar su primera mascota."
            >
              <Steps
                items={[
                  {
                    title: "Ve a Mascotas → «Nueva mascota»",
                    description: "Lo primero que pide es el CI del propietario.",
                  },
                  {
                    title: "Escribe el CI y espera un segundo",
                    description:
                      "Si esa persona ya está registrada, el sistema la reconoce sola y completa sus datos: no la duplicas. Si es nueva, te pide nombre, apellido y teléfono.",
                  },
                  {
                    title: "Completa los datos de la mascota",
                    description:
                      "Nombre, especie y sexo son obligatorios. Raza, fecha de nacimiento y peso son opcionales, pero la fecha de nacimiento es la que permite mostrar la edad, y el peso alimenta el gráfico de evolución.",
                  },
                ]}
              />

              <Callout tone="info" title="La ficha de la mascota">
                Haz clic en cualquier fila del listado para abrirla. Reúne los datos, un gráfico de evolución
                del peso (aparece recién con dos mediciones o más) y una línea de tiempo con todo lo que le pasó
                a esa mascota: atenciones, vacunas, citas y hasta las correcciones que alguien hizo a sus datos.
              </Callout>

              <Callout tone="warning" title="«Eliminar» no borra de verdad">
                Al eliminar una mascota deja de aparecer en los listados y buscadores, pero su historial se
                conserva y puedes reactivarla desde su propia ficha. Para verla otra vez, activa «Mostrar
                inactivas» en el listado. Se hace así a propósito: borrar de verdad significaría perder las
                atenciones y pagos asociados.
              </Callout>

              <p className="text-sm text-muted-foreground">
                En <strong>Propietarios</strong> se edita el nombre, teléfono y dirección de un cliente, y se ven
                sus mascotas como etiquetas en las que puedes hacer clic. El CI no se puede editar: es la clave
                con la que se busca a esa persona en todo el sistema.
              </p>
            </Section>

            {/* ------------------------------------------------------------ */}
            <Section
              id="agenda"
              icon={CalendarDays}
              title="Agenda"
              intro="Citas y horarios viven en la misma pantalla, porque el horario de cada veterinario es lo que determina qué turnos quedan libres."
            >
              <Steps
                items={[
                  {
                    title: "Pestaña «Nueva Cita»",
                    description:
                      "Elige mascota, veterinario, tipo de consulta y fecha. Los horarios disponibles aparecen agrupados en Mañana y Tarde; los ocupados salen deshabilitados.",
                  },
                  {
                    title: "Pestaña «Lista de Citas»",
                    description:
                      "La agenda agrupada por día. Desde cada cita puedes reprogramarla, marcarla como atendida o cancelarla.",
                  },
                  {
                    title: "Pestaña «Horarios»",
                    description:
                      "La grilla semanal de atención de cada veterinario, con hasta dos turnos por día (mañana y tarde). Recepción no ve esta pestaña.",
                  },
                ]}
              />

              <StateFlow
                from={{ label: "Confirmada", description: "Estado con el que nace toda cita nueva" }}
                to={[
                  { label: "Atendida", description: "La mascota vino y fue atendida", tone: "good" },
                  { label: "Cancelada", description: "No se realizó; el turno vuelve a quedar libre", tone: "muted" },
                ]}
              />

              <Callout tone="warning" title="Si no aparece ningún horario disponible">
                Casi siempre es porque <strong>ese veterinario no tiene horario cargado para ese día</strong> de
                la semana. Ve a la pestaña «Horarios», actívale el turno que corresponda y vuelve a intentar. Un
                veterinario sin horario ese día simplemente no tiene turnos que ofrecer.
              </Callout>

              <Callout tone="info" title="Reprogramar solo mueve fecha y hora">
                No cambia la mascota ni el veterinario: para eso, cancela y agenda una nueva. Y una cita
                cancelada ya no se puede reprogramar. Tampoco se puede poner dos citas al mismo veterinario a la
                misma hora — el sistema lo bloquea.
              </Callout>
            </Section>

            {/* ------------------------------------------------------------ */}
            <Section
              id="atencion"
              icon={Stethoscope}
              title="Atención médica"
              intro="El registro clínico de lo que se le hizo a la mascota."
            >
              <Steps
                items={[
                  {
                    title: "Busca la mascota por el CI de su dueño",
                    description:
                      "La pantalla arranca con un buscador. Al escribir el CI aparecen todas las mascotas de esa persona y eliges una.",
                  },
                  {
                    title: "Revisa su historial",
                    description:
                      "Debajo se listan las atenciones anteriores, con diagnóstico, tratamiento, peso y monto.",
                  },
                  {
                    title: "Pulsa «Nueva atención»",
                    description:
                      "Tipo de servicio, diagnóstico y tratamiento son obligatorios. Exámenes externos, peso actual y los medicamentos usados son opcionales.",
                  },
                ]}
              />

              <Callout tone="tip" title="Dos campos que hacen más de lo que parece">
                El <strong>peso actual</strong> se guarda como el peso vigente de la mascota y agrega un punto al
                gráfico de evolución de su ficha. Los <strong>medicamentos usados</strong> descuentan stock del
                inventario automáticamente — no hay que registrar la salida por separado.
              </Callout>

              <Callout tone="warning" title="Si falta stock, no se guarda nada">
                El sistema revisa el stock <em>antes</em> de crear la atención. Si un medicamento no alcanza, te
                avisa y no guarda: así no queda una atención a medias. Carga la entrada en Inventario y vuelve a
                intentar.
              </Callout>

              <p className="text-sm text-muted-foreground">
                Al guardar, la atención queda <strong>pendiente de cobro</strong> y aparece sola en la pantalla
                de Pagos.
              </p>
            </Section>

            {/* ------------------------------------------------------------ */}
            <Section
              id="preventivo"
              icon={ShieldPlus}
              title="Vacunas y desparasitación"
              intro="El control preventivo lleva la cuenta de qué se aplicó y cuándo toca la próxima dosis."
            >
              <Steps
                items={[
                  {
                    title: "Panel «Próximos a vencer»",
                    description:
                      "Lo primero que ves: los controles cuya próxima dosis cae dentro de los próximos 30 días. Los que ya pasaron su fecha llevan una etiqueta «Vencido» en rojo.",
                  },
                  {
                    title: "Busca una mascota por CI del dueño",
                    description: "Igual que en Atención médica, para ver su historial preventivo completo.",
                  },
                  {
                    title: "Registra el control",
                    description:
                      "Elige Vacuna o Desparasitación, la fecha en que se aplicó y —muy recomendable— la fecha de la próxima dosis.",
                  },
                ]}
              />

              <Callout tone="warning" title="Sin próxima dosis, no hay aviso">
                Un control sin fecha de próxima dosis se guarda igual, pero <strong>nunca va a aparecer</strong>{" "}
                en «Próximos a vencer» ni va a generar un recordatorio. Cárgala siempre que la sepas.
              </Callout>
            </Section>

            {/* ------------------------------------------------------------ */}
            <Section
              id="cobros"
              icon={Wallet}
              title="Cobros"
              intro="Todo lo que se atendió y todavía no se pagó, en una sola lista."
            >
              <Steps
                items={[
                  {
                    title: "Mira el pendiente total",
                    description:
                      "Arriba de la pantalla: cuánto falta cobrar en total y cuántas atenciones lo componen.",
                  },
                  {
                    title: "Pulsa «Registrar pago» en la fila que corresponda",
                    description:
                      "Eliges el método (Efectivo, Tarjeta, Transferencia o QR) y confirmas el monto. La atención pasa a pagada y desaparece de pendientes.",
                  },
                  {
                    title: "Revisa «Últimos pagos»",
                    description: "Los cinco cobros más recientes, con su método y fecha.",
                  },
                ]}
              />

              <Callout tone="warning" title="El botón «Cobrar con QR» todavía no cobra">
                Genera un QR bancario real, pero para eso hace falta conectar la API del banco de la clínica, y
                eso aún no está hecho. Hoy el botón muestra un mensaje explicando exactamente eso, en vez de un
                QR falso que nadie podría pagar. <strong>Para cobrar por QR mientras tanto</strong>, usa el QR
                de tu banco por fuera del sistema y registra el pago acá eligiendo el método «QR».
              </Callout>
            </Section>

            {/* ------------------------------------------------------------ */}
            <Section
              id="recordatorios"
              icon={MessageCircle}
              title="Recordatorios"
              intro="Avisos a los clientes por WhatsApp, para reducir las ausencias."
            >
              <Steps
                items={[
                  {
                    title: "Abre Recordatorios",
                    description:
                      "El sistema arma solo la lista: las citas de las próximas 24 horas y los controles preventivos que vencen dentro de 7 días.",
                  },
                  {
                    title: "Pulsa «Enviar por WhatsApp»",
                    description:
                      "Se abre WhatsApp con el número del propietario y el mensaje ya escrito. Puedes editarlo antes de enviarlo.",
                  },
                  {
                    title: "Vuelve y marca «Marcar como enviado»",
                    description:
                      "Es lo que saca a ese cliente de la lista y evita que le escriban dos veces. Queda registrado en «Últimos enviados».",
                  },
                ]}
              />

              <Callout tone="info" title="El envío es manual, no automático">
                El sistema calcula a quién hay que avisar y prepara el mensaje, pero alguien tiene que abrir la
                pantalla y hacer clic. No manda nada por su cuenta.
              </Callout>
            </Section>

            {/* ------------------------------------------------------------ */}
            <Section
              id="inventario"
              icon={Package}
              title="Inventario"
              intro="El stock de medicamentos, y su alerta cuando algo se está por acabar."
            >
              <Steps
                items={[
                  {
                    title: "Define el stock mínimo de cada medicamento",
                    description:
                      "Es el umbral de la alerta. Cuando el stock actual queda igual o por debajo, el medicamento aparece marcado como «Bajo stock» y se suma al aviso de arriba.",
                  },
                  {
                    title: "Registra las entradas cuando llega mercadería",
                    description: "El botón «Registrar entrada» suma al stock actual y queda como movimiento.",
                  },
                  {
                    title: "Las salidas se registran solas",
                    description:
                      "Cada vez que una atención médica consume un medicamento, el stock baja automáticamente.",
                  },
                ]}
              />

              <Callout tone="info" title="Por qué a veces no se puede eliminar un medicamento">
                Si ya tuvo movimientos (entradas o consumos), el sistema no lo deja borrar: haría desaparecer
                parte del historial. Solo se pueden eliminar los que nunca se usaron.
              </Callout>
            </Section>

            {/* ------------------------------------------------------------ */}
            <Section
              id="reportes"
              icon={FileBarChart}
              title="Reportes"
              intro="Solo Administrador. Dos miradas sobre la misma información."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border p-3.5">
                  <p className="mb-1 font-medium">Ingresos</p>
                  <p className="text-sm text-muted-foreground">
                    Cada pago cobrado, con filtros por rango de fechas, tipo de servicio y método de pago. Arriba
                    muestra el total y la cantidad de cobros que cumplen esos filtros.
                  </p>
                </div>
                <div className="rounded-lg border p-3.5">
                  <p className="mb-1 font-medium">Clínicos y administrativos</p>
                  <p className="text-sm text-muted-foreground">
                    Dos vistas: las atenciones de un período, y un gráfico de ingresos agrupados por tipo de
                    servicio, que responde qué servicio deja más.
                  </p>
                </div>
              </div>

              <Callout tone="tip" title="Todo se puede exportar">
                Cada reporte tiene botones para descargarlo en Excel o PDF, con los filtros que tengas puestos.
                Además, en Configuración hay «Exportar todos mis datos»: un Excel con una hoja por cada tipo de
                información del sistema.
              </Callout>
            </Section>

            {/* ------------------------------------------------------------ */}
            <Section
              id="usuarios"
              icon={UserCog}
              title="Cuentas del personal"
              intro="Solo Administrador. Quién puede entrar al sistema y con qué permisos."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border p-3.5">
                  <p className="mb-1 font-medium">Crear una cuenta</p>
                  <p className="text-sm text-muted-foreground">
                    «Nuevo usuario» pide los datos y el rol. Si eliges Veterinario, aparecen dos campos más:
                    matrícula y especialidad.
                  </p>
                </div>
                <div className="rounded-lg border p-3.5">
                  <p className="mb-1 font-medium">Invitar a un veterinario</p>
                  <p className="text-sm text-muted-foreground">
                    «Invitar veterinario» le manda un correo con un enlace para que complete sus datos. La cuenta
                    queda activa apenas la acepta.
                  </p>
                </div>
                <div className="rounded-lg border p-3.5">
                  <p className="mb-1 font-medium">Aprobar una solicitud</p>
                  <p className="text-sm text-muted-foreground">
                    Un veterinario puede pedir acceso solo, desde el enlace del login. Aparece como «Pendiente de
                    aprobación» y no puede entrar hasta que pulses «Aprobar».
                  </p>
                </div>
                <div className="rounded-lg border p-3.5">
                  <p className="mb-1 font-medium">Auditoría</p>
                  <p className="text-sm text-muted-foreground">
                    La segunda pestaña registra quién activó, desactivó, cambió de rol, restableció contraseñas o
                    invitó a alguien, y cuándo.
                  </p>
                </div>
              </div>

              <Callout tone="warning" title="Desactivar en vez de borrar">
                Las cuentas no se eliminan, se desactivan: quien está desactivado no puede iniciar sesión y
                desaparece de las listas para agendar o atender, pero su historial queda intacto. Se reactiva
                cuando haga falta.
              </Callout>
            </Section>

            {/* ------------------------------------------------------------ */}
            <Section
              id="cuenta"
              icon={Settings}
              title="Tu cuenta"
              intro="Lo que puedes cambiar de tu propia sesión, desde Configuración."
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border p-3.5">
                  <p className="mb-1 font-medium">Apariencia</p>
                  <p className="text-sm text-muted-foreground">
                    Tema claro, oscuro o el del sistema, y tres colores de acento. Se guarda en tu navegador.
                  </p>
                </div>
                <div className="rounded-lg border p-3.5">
                  <p className="mb-1 font-medium">Contraseña</p>
                  <p className="text-sm text-muted-foreground">
                    Cambiarla te pide la actual. Mínimo 6 caracteres.
                  </p>
                </div>
                <div className="rounded-lg border p-3.5">
                  <p className="mb-1 font-medium">Cerrar sesión</p>
                  <p className="text-sm text-muted-foreground">
                    Desde tu nombre, al pie del menú. La sesión también caduca sola a las 8 horas.
                  </p>
                </div>
              </div>
            </Section>

            {/* ------------------------------------------------------------ */}
            <Section id="faq" icon={HelpCircle} title="Preguntas frecuentes">
              <Faq
                items={[
                  {
                    question: "Registré una atención pero no aparece en Pagos",
                    answer:
                      "Revisa que no la hayas cobrado ya: una vez pagada sale de «Pendientes» y pasa a «Últimos pagos». Si sigue sin aparecer, recarga la pantalla.",
                  },
                  {
                    question: "No me deja agendar: no hay horarios disponibles",
                    answer:
                      "Ese veterinario no tiene horario cargado para ese día de la semana. Cárgaselo en Agenda → Horarios. Si eres veterinario, recuerda que solo puedes agendar para ti mismo.",
                  },
                  {
                    question: "¿Por qué no puedo eliminar una mascota o un medicamento?",
                    answer:
                      "Las mascotas sí se pueden «eliminar», pero es un borrado reversible: se ocultan y se pueden reactivar. Los medicamentos con movimientos registrados no se borran, porque eso rompería el historial de inventario.",
                  },
                  {
                    question: "El cobro por QR me da error",
                    answer:
                      "Es lo esperado por ahora: falta conectar la API del banco de la clínica. Cobra con el QR de tu banco por fuera del sistema y registra el pago acá con el método «QR».",
                  },
                  {
                    question: "Un veterinario no aparece en la lista para agendar",
                    answer:
                      "Probablemente su cuenta está desactivada o pendiente de aprobación. Revísalo en Usuarios: las listas para agendar y atender solo ofrecen veterinarios activos.",
                  },
                  {
                    question: "¿Puedo usar PawCare en el celular o la tablet?",
                    answer:
                      "Sí. Todas las pantallas se adaptan, y las tablas se muestran como tarjetas para que se lean sin desplazarse de lado. Además puedes instalarlo como aplicación desde el menú del navegador.",
                  },
                  {
                    question: "No me llegó el correo de invitación o de recuperar contraseña",
                    answer:
                      "El envío de correo requiere que la clínica lo tenga configurado. Si no llega, el Administrador puede crear la cuenta directamente, o restablecer la contraseña desde Usuarios y comunicarla en persona.",
                  },
                ]}
              />
            </Section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
