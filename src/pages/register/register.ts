import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, MenuController, NavController, ToastController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as AppConst from '../../core/utils/app.const';
import {PasswordValidation} from "../../core/utils/passwordValidation";
import {UserService} from "../../services/user/user.service";
import {formatCep, formatPhone} from "../../core/utils/formatters";

@IonicPage({
  defaultHistory: ['LoginPage']
})
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  form: FormGroup;

  constructor(public navCtrl: NavController,
              private userService: UserService,
              private toastController: ToastController,
              private menuController: MenuController,
              private alertController: AlertController,
              private loadingController: LoadingController,
              private formBuilder: FormBuilder) {

    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.pattern(AppConst.emailPattern)]],
      password: ['', [Validators.required, Validators.pattern(AppConst.passwordPattern)]],
      confirmPassword: ['', [Validators.required]],
      phone: ['', [Validators.pattern(AppConst.phonePattern)]],
      linkedin: ['', [Validators.pattern(AppConst.linkedInUrlPattern)]],
      postalCode: ['', [Validators.required, Validators.pattern(AppConst.postalCodePattern)]],

      street: ['', [Validators.required]],
      number: [null, [Validators.required]],
      complement: [''],
      neighborhood: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
    }, {
      validator: PasswordValidation.MatchPassword
    });

    const phoneControl = this.form.get('phone');
    phoneControl.valueChanges.subscribe(value => {
      phoneControl.setValue(formatPhone(value), {emitEvent: false})
    });

    const postalCodeControl = this.form.get('postalCode');
    postalCodeControl.valueChanges.subscribe(value => {
      postalCodeControl.setValue(formatCep(value), {emitEvent: false})
    });
    postalCodeControl.statusChanges.subscribe(validity => {
      if (validity === 'VALID') {
        this.getAddress(postalCodeControl.value);
      }
    })
  }

  getAddress(cep) {
    this.userService.consultarCEP(cep).subscribe(address => {
      const {localidade, uf, bairro, logradouro, erro} = <any>address;

      if (erro) {
        this.clearAddress();
      } else {
        this.form.get('street').setValue(logradouro);
        this.form.get('neighborhood').setValue(bairro);
        this.form.get('city').setValue(localidade);
        this.form.get('state').setValue(uf);
        this.form.get('country').setValue('Brasil');
      }
    }, err => {
      this.clearAddress();
    })
  }

  clearAddress() {
    this.form.get('street').setValue('');
    this.form.get('neighborhood').setValue('');
    this.form.get('city').setValue('');
    this.form.get('state').setValue('');
    this.form.get('country').setValue('');
  }

  submit(values) {

    if (this.form.valid) {
      const loading = this.loadingController.create();
      loading.present();
      this.userService.register(values).subscribe(
        data => {
          loading.dismiss();
          if (data.success || data.authenticated) {
            this.menuController.enable(true);
            this.navCtrl.setRoot('TabsPage');
          } else {
            const alert = this.alertController.create();
            alert.setTitle('Ops...');
            alert.setMessage(data.messages[0]);
            alert.addButton('Ok');
            alert.present();
          }
        },
        error => {
          loading.dismiss();
          const alert = this.alertController.create();
          alert.setTitle('Ops...');
          alert.setMessage('Não foi possível efetuar seu registro. Verifique sua conexão e tente novamente');
          alert.addButton('Ok');
          alert.present();
        }
      );
    } else {
      for (const key of Object.keys(this.form.controls)) {
        this.form.get(key).markAsTouched();
      }
      this.toastController.create({message: 'Preencha todos os campos obrigatórios', duration: 2500}).present();
    }
  }


}
