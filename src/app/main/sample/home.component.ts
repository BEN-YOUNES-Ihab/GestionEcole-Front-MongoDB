import { Component, OnInit } from '@angular/core'
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import { EcoleService } from '../services/ecole.service';
import { Ecole } from '../models/ecole.model';
import { ModalsService } from '../shared/services/modals.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public showAdd !: boolean;
  public showUpdate !: boolean;
  public ecoleSubmitted = false;
  selectedEcole = new Ecole;
  contentHeader: ContentHeader = {
    headerTitle: 'Ecoles',
    actionButton: false,
    breadcrumb: {
      links: [
        { name: "Gestion d'ecoles" }
      ]
    }
  };

  public ecolesList : Ecole[];
  public keyword = "";
  constructor(
    private ecoleService : EcoleService,
    private modalService: NgbModal,
     private modalsService : ModalsService,
      private toastr: ToastrService) {}

  ngOnInit() {
    this.getEcoles();
  }
  getEcoles(){
    this.ecoleService.getEcoleList(this.keyword).subscribe(data =>{
      this.ecolesList = data as Ecole[];
    });
  }
  clickAddEcole(modalBasic){
    this.ecoleSubmitted = false;
    this.showAdd = true;
    this.showUpdate = false
    this.selectedEcole = new Ecole;
    this.modalService.open(modalBasic, {
      windowClass: 'modal'
    });
    ;
  }
  clickEditEcole(ecole: Ecole ,modalBasic){
    this.ecoleSubmitted = false;
    this.selectedEcole = ecole;
    this.showAdd = false;
    this.showUpdate = true;
    this.modalService.open(modalBasic, {
      windowClass: 'modal'
    });
    
  }

  deleteEcole(id : string){
    this.modalsService.openConfirmationModal('Voulez-vous vraiment supprimer cette école ?', 'danger', 'Supprimer').then(result => {
      if (result) {
        console.log(this.ecolesList);
        this.ecoleService.deleteEcole(id).subscribe(data => {
          if (data) {
            const index = this.ecolesList.findIndex(x => x._id == id);
            this.ecolesList.splice(index, 1);
            this.toastr.success('Opération éffectuée', 'Succès');
          }
        }, (err) => {
          this.toastr.error('Opération écchouée', 'Échec');
        });
      }
    }, () => { })
  }
  postEcoleDetails(form: NgForm){
    this.ecoleSubmitted = true;
    if(form.invalid){
      return;
    }
    this.ecoleService.postEcole(this.selectedEcole).subscribe(res=>{
      this.ecoleSubmitted = false;
      this.toastr.success('Opération éffectuée', 'Succès');
      this.getEcoles();
      this.modalService.dismissAll();
    },err=>{
      this.toastr.error('Opération écchouée', 'Échec');
    });
  }
  updateEcoleDetails(form: NgForm){
    this.ecoleSubmitted = true;
    if(form.invalid){
      return;
    }
    this.ecoleService.putEcole(this.selectedEcole).subscribe(res=>{
      this.ecoleSubmitted = false;
      this.toastr.success('Opération éffectuée', 'Succès');
      this.getEcoles();
      this.modalService.dismissAll();
    },err=>{
      this.toastr.error('Opération écchouée', 'Échec');
    });
  }
}
