// import { Component,Input } from '@angular/core';
// import { NzModalService  } from 'ng-zorro-antd/modal';
// import { NzModalRef } from 'ng-zorro-antd/modal';

// @Component({
//   selector: 'app-create-group-modal',
//   templateUrl: './create-group-modal.component.html',
//   styleUrl: './create-group-modal.component.css'
// })
// export class CreateGroupModalComponent {
//   groupName: string = ''; // Property to store the entered group name

//   // isVisible: boolean = false; // Make sure isVisible is a boolean type
  
//   constructor(
//     private modalRef: NzModalRef,
//     private modalService: NzModalService
//     ) {}

//   // showModal(): void {
//   //   this.isVisible = false;
//   //   console.log('showModal clicked');
//   // }

//   // handleOk(): void {
//   //   console.log('Button ok clicked!');
//   //   this.isVisible = false;
//   // }

//   // handleCancel(): void {
//   //   console.log('Button cancel clicked!');
//   //   this.isVisible = false;
//   // }

//   handleOk(): void {
//     if (this.groupName.trim() !== '') {
//       this.modalRef.close(this.groupName.trim());
//     }
//   }

//   handleCancel(): void {
//     this.modalRef.close();
//   }
  
// }
