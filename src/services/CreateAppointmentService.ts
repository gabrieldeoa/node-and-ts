import { startOfHour } from 'date-fns';

import Appoitment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface AppointmentRequest {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  private appoitmentsRepository: AppointmentsRepository;

  constructor(appoitmentsRespository: AppointmentsRepository) {
    this.appoitmentsRepository = appoitmentsRespository;
  }

  public execute({ provider, date }: AppointmentRequest): Appoitment {
    const appointmentDate = startOfHour(date);

    const findAppoitmentInSameDate = this.appoitmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppoitmentInSameDate) {
      throw Error('This appointment is already booked');
    }

    const appointment = this.appoitmentsRepository.create({
      provider,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
