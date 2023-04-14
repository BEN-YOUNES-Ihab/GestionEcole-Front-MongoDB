import { Component, OnInit } from '@angular/core';
import { Classe } from '../models/classe.model';
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import { ClasseService } from '../services/classe.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalsService } from '../shared/services/modals.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit {

  contentHeader: ContentHeader = {
    headerTitle: 'Classes',
    actionButton: false,
    breadcrumb: {
      links: [
        { name: "Gestion de classe" }
      ]
    }
  };

  public showAdd !: boolean;
  public showUpdate !: boolean;
  public classeSubmitted = false;
  public classes: Classe[] = [];
  public selectedClasse: Classe = new Classe();
  public ecoleId: number ;
  public keyword: string = '';
  public page: number = 0;
  public size: number = 5;
  public totalElements: number = 0;
  public totalPages: number = 0;

  constructor(
      private classeService: ClasseService,
      private route: ActivatedRoute,
      private modalService: NgbModal,
      private modalsService : ModalsService,
      private toastr: ToastrService) { }

  ngOnInit() {
    this.ecoleId = Number(this.route.snapshot.paramMap.get('id'));
    this.getClasses();
  }

  clickAddClasse(modalBasic){
    this.classeSubmitted = false;
    this.showAdd = true;
    this.showUpdate = false
    this.selectedClasse = new Classe;
    console.log(this.showAdd)
    this.modalService.open(modalBasic, {
      windowClass: 'modal'
    });
    ;
  }
  clickEditClasse(classe: Classe ,modalBasic){
    this.classeSubmitted = false;
    this.selectedClasse = classe;
    this.showAdd = false;
    this.showUpdate = true;
    this.modalService.open(modalBasic, {
      windowClass: 'modal'
    });
    
  }
  addClasseDetails() {
    this.classeService.addClasseByEcoleId(this.ecoleId, this.selectedClasse).subscribe(
      (data) => {
        this.classeSubmitted = false;
        this.toastr.success('Opération éffectuée', 'Succès');
        this.modalService.dismissAll();
        this.selectedClasse = new Classe();
        this.getClasses();
      },err=>{
        this.toastr.error('Opération écchouée', 'Échec');
        console.error(err);
      }
    );
  }
  editClasseDetails(classe :Classe) {
    this.classeService.updateClasse(classe).subscribe(
      (data) => {
        this.classeSubmitted = false;
        this.toastr.success('Opération éffectuée', 'Succès');
        this.modalService.dismissAll();
        this.selectedClasse = new Classe();
        this.getClasses();
      },err=>{
        this.toastr.error('Opération écchouée', 'Échec');
        console.error(err);
      }
    );
  }
  deleteClasse(classe :Classe){
    this.modalsService.openConfirmationModal('Voulez-vous vraiment supprimer cette classe ?', 'danger', 'Supprimer').then(result => {
      if (result) {
        this.classeService.deleteClasse(classe.id).subscribe(data => {
          this.classeSubmitted = false;
          this.toastr.success('Opération éffectuée', 'Succès');
          this.modalService.dismissAll();
          this.getClasses();
        }, (err) => {
          this.toastr.error('Opération écchouée', 'Échec');
        });
      }
    }, () => { })
  }
  search() {
    this.getClasses();
  }

  getClasses() {
    this.classeService.getClassesByEcoleId(this.ecoleId, this.keyword, this.page, this.size).subscribe(
      (data) => {
        console.log('Classes fetched successfully', data);
        this.classes = data.content;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
      },
      (error) => console.log(error)
    );
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.getClasses();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.getClasses();
    }
  }
  changePageSize(){
    this.getClasses();
  }
}
