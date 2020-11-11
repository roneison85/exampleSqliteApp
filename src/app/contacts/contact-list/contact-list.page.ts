import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Contact } from '../shared/contact';
import { ContactService } from '../shared/contact.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.page.html',
  styleUrls: ['./contact-list.page.scss'],
})
export class ContactListPage implements OnInit {
  contacts: Contact[] = [];

  constructor(
    private contactService: ContactService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadContacts();
  }

  async loadContacts() {
    this.contacts = await this.contactService.getAll();
  }

  doSearchClear() {
    this.loadContacts();
  }

  async doSearchChange($event: any) {
    const value = $event.target.value;
    if (value  && value.length >= 2){
      this.contacts = await this.contactService.filter(value);
    }
  }

  async delete(contact: Contact){
    const alert = await this.alertCtrl.create({
      header: 'Deletar?',
      message: `Deseja excluir o contato: ${contact.name}`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          handler: () => {
            this.executeDelete(contact);
          }
        }
      ]
    });
    alert.present();
  }

  async executeDelete(contact: Contact) {
    try {
      await  this.contactService.delete(contact.id);

      const index = this.contacts.indexOf(contact);
      this.contacts.splice(index, 1);

      const toast = await this.toastCtrl.create({
        header: 'Sucesso',
        message: 'Contato excluído com sucesso.',
        color: 'success',
        position: 'bottom',
        duration: 3000
      });
      toast.present();
    } catch (error) {
      const toast = await this.toastCtrl.create({
        header: 'Erro',
        message: 'Ocorreu um erro ao tentar excluir o Contato.',
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });
      toast.present();
    }
  }

}
