export const RESERVATION_UPDATED_EVENT = 'reservationUpdated';

export const emitReservationUpdate = () => {
  const event = new CustomEvent(RESERVATION_UPDATED_EVENT);
  window.dispatchEvent(event);
};