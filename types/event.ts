export interface Event {
  idEvent: number;
  naziv: string;
  pocetakDogadjaja: string;
  krajDogadjaja: string;
  opis: string;
  vazan: boolean;
  privatnost: string;
  idCategory: number | null;
}
