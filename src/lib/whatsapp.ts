/**
 * Enlace `wa.me` con el mensaje ya escrito.
 *
 * Los teléfonos se cargan como los dicta el cliente ("70011122", "+591 700 11122")
 * y WhatsApp los quiere sin símbolos y con código de país, así que se normalizan
 * acá. Bolivia (591) es el único código que asume: es un producto de una clínica
 * boliviana y sus clientes son locales.
 */
export function whatsappNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.startsWith("591") ? cleaned : `591${cleaned}`;
}

export function whatsappLink(phone: string, message: string): string {
  return `https://wa.me/${whatsappNumber(phone)}?text=${encodeURIComponent(message)}`;
}
