import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const { metatype } = metadata;

    // Проверяем, что metatype существует и это класс
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Преобразуем объект в класс
    const obj = plainToInstance(metatype, value);

    // Валидируем объект
    const errors = await validate(obj);

    if (errors.length > 0) {
      // Формируем сообщения об ошибках
      const messages = errors.map((err) => {
        if (err.constraints) {
          return `${err.property} - ${Object.values(err.constraints).join(', ')}`;
        }
        return `${err.property} - Validation error`;
      });

      // Выбрасываем исключение с сообщениями об ошибках
      throw new BadRequestException(messages);
    }

    return value;
  }

  // Метод для проверки, что metatype является классом
  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
