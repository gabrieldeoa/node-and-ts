import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appoitment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ provider, date }: Request): Promise<Appoitment> {
    const appoitmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppoitmentInSameDate = await appoitmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppoitmentInSameDate) {
      throw Error('This appointment is already booked');
    }

    const appointment = appoitmentsRepository.create({
      provider,
      date: appointmentDate,
    });

    await appoitmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
