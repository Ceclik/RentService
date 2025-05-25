import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Contract } from './contracts.model';
import { Booking } from '@modules/bookings/bookings.model';
import { Property } from '@modules/properties/properties.model';
import { Transaction } from 'sequelize';

@Injectable()
export class ContractsRepository {
  constructor(
    @InjectModel(Contract) private readonly contractRepository: typeof Contract,
  ) {}

  async createTransaction() {
    return await this.contractRepository.sequelize?.transaction();
  }

  async findAllWithEndDate(today: Date) {
    return await this.contractRepository.findAll({
      include: [
        {
          model: Booking,
          where: { endDate: today },
        },
      ],
    });
  }

  async changeToClosedStatus(contract: Contract) {
    await contract.update({ status: 'closed' });
  }

  async createContract(
    totalPrice: number,
    booking: Booking,
    property: Property,
  ) {
    await this.contractRepository.create({
      totalPrice,
      bookingId: booking.id,
      ownerId: property.ownerId,
      clientId: booking.clientId,
    });
  }

  async findByIdIncludingBookings(id: number) {
    return await this.contractRepository.findByPk(id, {
      include: { model: Booking },
    });
  }

  async confirmContract(contractToConfirm: Contract, transaction: Transaction) {
    await contractToConfirm.update({ status: 'confirmed' }, { transaction });
  }

  async findAllContractsOfClient(clientId: number) {
    return await this.contractRepository.findAll({
      where: { clientId },
    });
  }

  async findAllOfOwner(ownerId: number) {
    return await this.contractRepository.findAll({ where: { ownerId } });
  }

  async findAllOfProperty(propertyId: number) {
    return await this.contractRepository.findAll({
      include: [
        {
          model: Booking,
          where: { propertyId },
        },
      ],
    });
  }
}
