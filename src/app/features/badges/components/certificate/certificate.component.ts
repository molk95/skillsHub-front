import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent {
  @Input() userName: string = 'Utilisateur';
  @Input() certificateImageUrl: string =
    'https://ui-avatars.com/api/?name=Certificat&background=ffcc00&color=000&bold=true&format=png';

}
