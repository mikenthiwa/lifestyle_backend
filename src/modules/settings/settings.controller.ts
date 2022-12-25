import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/JwtAuthGuard.guard';
import { Role } from '../auth/schema/user.schema';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guard/role.guard';

@Controller('settings')
export class SettingsController {
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/add_partner')
  addPartner(@Request() req: any) {
    console.log(req.user);
    console.log('running');
  }
}
