import { Email } from "./Email";

export class Cliente{

    id: number = 0;
    inscricao: string = '';
    nome: string = '';
    apelido: string = '';
    urlFoto: string = '';
    status: string = '';
    emails: Email[] = [];
    
}