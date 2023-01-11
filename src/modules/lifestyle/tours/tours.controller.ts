import {
  Controller,
  UseGuards,
  Post,
  Get,
  Request,
  Response,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/schema/user.schema';
import { JwtAuthGuard } from '../../auth/guard/JwtAuthGuard.guard';
import { RolesGuard } from '../../auth/guard/role.guard';
import { ToursService } from './tours.service';
import {
  TripBodyDTO,
  UpdateTripBody,
  DeleteTripBody,
  SelectedTripBody,
} from './dto/tours.dto';

@Controller('tours')
export class ToursController {
  constructor(private tourService: ToursService) {}

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/create_trip')
  async createTrip(
    @Request() req: any,
    @Response() res: any,
    @Body() tripBody: TripBodyDTO,
  ): Promise<any> {
    const createdTrip = await this.tourService.createTrip(
      req.user._id,
      tripBody,
    );
    res.send({
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Trip added successfully',
      responseObject: createdTrip,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('')
  async getTrips(@Request() req: any, @Response() res: any): Promise<any> {
    const tripDoc = await this.tourService.getTrips();
    res.send({
      success: true,
      statusCode: HttpStatus.OK,
      response: tripDoc,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async getSelectedTrip(
    @Request() req: any,
    @Response() res: any,
    @Body() selectedTripBody: SelectedTripBody,
  ): Promise<any> {
    const tripDoc = this.tourService.selectTrips(selectedTripBody.tripId);
    res.send({
      success: true,
      statusCode: HttpStatus.OK,
      response: tripDoc,
    });
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/update_trip')
  async updateTrip(
    @Request() req: any,
    @Response() res: any,
    @Body() updateTripBody: UpdateTripBody,
  ): Promise<any> {
    await this.tourService.updateTrip(
      req.user._id,
      req.body.tripId,
      updateTripBody,
    );
    res.send({
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Trip Updated successfully',
    });
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/delete_trip')
  async deleteTrip(
    @Request() req: any,
    @Response() res: any,
    @Body() deleteTripBody: DeleteTripBody,
  ): Promise<any> {
    await this.tourService.deleteTrip(req.user._id, deleteTripBody.tripId);
    res.send({
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Trip deleted successfully',
    });
  }
}
