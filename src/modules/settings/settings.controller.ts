import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  Body,
  Response,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/JwtAuthGuard.guard';
import { Role } from '../auth/schema/user.schema';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guard/role.guard';
import { PartnerFormDto, UpdateFormDto } from './dto/partner.dto';
import { PartnersService } from '../partners/partners.service';

@Controller('settings')
export class SettingsController {
  constructor(private partnerService: PartnersService) {}
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/add_partner')
  async addPartner(
    @Request() req: any,
    @Response() res: any,
    @Body() partnerBody: PartnerFormDto,
  ) {
    await this.partnerService.addPartner({
      ...partnerBody,
      admin: [req.user._id],
    });
    res.send({
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Partner added successfully',
    });
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/partner')
  async getPartner(@Request() req: any, @Response() res: any) {
    const partner = await this.partnerService.getPartner(req.user._id);
    res.send({
      success: true,
      statusCode: HttpStatus.OK,
      response: partner,
    });
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/update_partner')
  async updatePartner(
    @Request() req: any,
    @Response() res: any,
    @Body() updatePartnerBody: UpdateFormDto,
  ): Promise<void> {
    await this.partnerService.updatePartner(req.user._id, updatePartnerBody);
    res.send({
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Partner updated successfully',
    });
  }
}
