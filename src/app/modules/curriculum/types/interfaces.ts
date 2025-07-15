
export interface Subject {
  name: string;
  credits: number;
}

export interface Semester {
  name: string;
  subjects: Subject[];
}

export interface Concentration {
  name: string;
  semesters: Semester[];
}

export interface Major {
  name: string;
  concentrations: Concentration[];
}

export interface Curriculum {
  name: string;
  majors: Major[];
}