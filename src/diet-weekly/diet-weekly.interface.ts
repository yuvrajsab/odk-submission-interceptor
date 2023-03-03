import { ODKFormSubmission } from '../interface/odk-submission.interface';
import { ODKFormSubmissionAttachment } from '../interface/odk-submission-attachment.interface';
import { ODKFormSubmissionData } from '../interface/odk-submission-data.interface';

export interface DietWeeklySubmissionData extends ODKFormSubmissionData {
  week: string;
  month: string;
  pictures: ODKFormSubmissionAttachment | null;
  wingname: string;
  authority: string;
  user_name: string | null;
  form_intro: string | null;
  description: string;
  misc_undertaken: number;
  planned_projects: number;
  scert_undertaken: number;
  started_projects: number;
  wingsupport_v101: string;
  wingsupport_v102: string;
  wingsupport_v103: string;
  completed_projects: number;
  suomotu_undertaken: number;
  supportingwing_v101: string[] | null;
  supportingwing_v102: string[] | null;
  supportingwing_v103: string[] | null;
  typeofprojects_v101: string;
  typeofprojects_v102: string;
  typeofprojects_v103: string;
}

export interface DietWeeklySubmission extends ODKFormSubmission {
  data: DietWeeklySubmissionData[];
}
