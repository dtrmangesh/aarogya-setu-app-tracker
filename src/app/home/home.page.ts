import { Component } from '@angular/core';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { DiagnosticService } from '../services/diagnostic.service';
import { Router,ActivatedRoute } from '@angular/router';
import { AppAvailabilityService } from '../services/app-availability.service';
import { HardwareSoftwareAvailability } from '../interface/hardware.interface';
import { FirebaseService } from '../services/firebase.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isAppInstalled: any;
  hardwareAvailiability: HardwareSoftwareAvailability = {
    appAvailability: false,
    locationStatus: false,
    bluetoothStatus:false
    
  };
  userData: any;
  constructor(private diagnostic: DiagnosticService,
    private readonly router: Router,
    private openNativeSettings: OpenNativeSettings,
    private appAvailable: AppAvailabilityService,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute) {
      
  }

  cardTitles = ['Confirmed cases', 'Active cases', 'Recovered cases', 'Deceased cases'];
  sliderImages= ['assets/images/cover_mouth_sneeze.png',
  'assets/images/wash_hands_2.png',
  'assets/images/social_distance.png',
  'assets/images/stay_home.png']
  userName:string;

  sliderOpts = {
    autoplay: true,
    zoom: {
      maxRatio: 5
    }
  };

  async ionViewWillEnter() {
    this.route.queryParams.subscribe(params => {
      if (params && params.userData) {
        this.userData = JSON.parse(params.userData);
        this.userName = this.userData.name
      }
    });

    this.hardwareAvailiability.bluetoothStatus =  await  this.diagnostic.checkBluetoothAvailability();
    this.hardwareAvailiability.locationStatus = await this.diagnostic.checkGPSAvailability();

    this.hardwareAvailiability.appAvailability = await this.appAvailable.onCheckAppAvailability();
    var hardwareSoftwareAvailability :HardwareSoftwareAvailability = {
      appAvailability: this.hardwareAvailiability.appAvailability,
      bluetoothStatus: this.hardwareAvailiability.bluetoothStatus,
      locationStatus:this.hardwareAvailiability.locationStatus
    }
    this.firebaseService.updateUserHardware(this.userData.id,hardwareSoftwareAvailability);
  }
  
  onLogout() {
    this.router.navigate(['/login']);
  }

  onManageSettings() {
    this.openNativeSettings.open('settings');
  }
}