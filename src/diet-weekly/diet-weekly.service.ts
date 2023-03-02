import { Injectable, Logger } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { DietWeeklySubmissionData } from './diet-weekly.interface';
import { validateData } from '../helper/odk-submission.helper';

@Injectable()
export class DietWeeklyService {
  private readonly logger = new Logger(DietWeeklyService.name);

  constructor(private readonly appService: AppService) {}

  getWingNameShortForm(wingName: string): string {
    if (wingName === 'pre_service') {
      return 'PSTE';
    } else if (wingName === 'in_service') {
      return 'IFIC';
    } else if (wingName === 'dru') {
      return 'DRU';
    } else if (wingName === 'edtech') {
      return 'ET';
    } else if (wingName === 'curriculum_assessment') {
      return 'CMDE';
    } else if (wingName === 'planning') {
      return 'P&M';
    } else if (wingName === 'work_ex') {
      return 'WE';
    }
    return wingName;
  }

  getFromWeekMap(week: string): string {
    if (week === 'week 1') {
      return 'W1';
    } else if (week === 'week 2') {
      return 'W2';
    } else if (week === 'week 3') {
      return 'W3';
    } else if (week === 'week 4') {
      return 'W4';
    } else if (week === 'week 5') {
      return 'W5';
    }
    return week;
  }

  getFromWingNameMap(wingName: string): string {
    if (wingName === 'pre_service') {
      return 'Pre-service Training and Education';
    } else if (wingName === 'in_service') {
      return 'In-service Training and Field Interactions';
    } else if (wingName === 'dru') {
      return 'District Resource Unit';
    } else if (wingName === 'edtech') {
      return 'Education Technology';
    } else if (wingName === 'curriculum_assessment') {
      return 'Curriculum, Material Development & Assessment';
    } else if (wingName === 'planning') {
      return 'Planning and Management';
    } else if (wingName === 'work_ex') {
      return 'Work Experience';
    }
    return wingName;
  }

  getFromTypeOfProjectMap(typeOfProject: string): string {
    if (typeOfProject === 'Trainings') {
      return 'Trainings/Workshops/Seminar/Event';
    } else if (typeOfProject === 'Visits') {
      return 'School Visits/Monitoring';
    } else if (typeOfProject === 'Research') {
      return 'Research/Analysis';
    } else if (typeOfProject === 'Other') {
      return 'Other';
    } else if (typeOfProject === 'None') {
      return 'None';
    }
    return typeOfProject;
  }

  getFromWingSupportMap(wingSupport: string): string {
    if (wingSupport === 'yes') {
      return 'Yes';
    } else if (wingSupport === 'no') {
      return 'No';
    }
    return wingSupport;
  }

  getFromSupportWingMap(supportWing: string[] | null): string {
    if (supportWing === null) {
      return 'NA';
    }

    return supportWing
      .map((sw) => {
        if (sw === 'pre_service') {
          return 'Pre-service Training and Education';
        } else if (sw === 'in_service') {
          return 'In-service Training and Field Interactions';
        } else if (sw === 'dru') {
          return 'District Resource Unit';
        } else if (sw === 'edtech') {
          return 'Education Technology';
        } else if (sw === 'curriculum_assessment') {
          return 'Curriculum, Material Development & Assessment';
        } else if (sw === 'planning') {
          return 'Planning and Management';
        } else if (sw === 'work_ex') {
          return 'Work Experience';
        }
      })
      .join(', ');
  }

  extractMonthFromDate(date: string): string {
    return new Date(date).toLocaleString('default', { month: 'long' });
  }

  createMappingForPdf(data: DietWeeklySubmissionData) {
    return {
      username: validateData(data.user_name),
      month: this.extractMonthFromDate(data.month),
      year: '2023',
      week: this.getFromWeekMap(data.week),
      wingname: this.getFromWingNameMap(data.wingname),
      tp_planned_projects: validateData(data.planned_projects),
      tp_started_projects: validateData(data.started_projects),
      tp_completed_projects: validateData(data.completed_projects),
      suo_suomotu_undertaken: validateData(data.suomotu_undertaken),
      suo_typeofprojects_v101: this.getFromTypeOfProjectMap(
        data.typeofprojects_v101,
      ),
      suo_description: '',
      suo_wingsupport_v101: this.getFromWingSupportMap(data.wingsupport_v101),
      suo_supportingwing_v101: this.getFromSupportWingMap(
        data.supportingwing_v101,
      ),
      scert_scert_undertaken: validateData(data.scert_undertaken),
      scert_typeofprojects_v102: this.getFromTypeOfProjectMap(
        data.typeofprojects_v102,
      ),
      scert_description: '',
      scert_wingsupport_v102: this.getFromWingSupportMap(data.wingsupport_v102),
      scert_supportingwing_v102: this.getFromSupportWingMap(
        data.supportingwing_v102,
      ),
      oa_misc_undertaken: validateData(data.misc_undertaken),
      oa_authority: validateData(data.authority),
      oa_typeofprojects_v103: this.getFromTypeOfProjectMap(
        data.typeofprojects_v103,
      ),
      oa_description: '',
      oa_wingsupport_v103: this.getFromWingSupportMap(data.wingsupport_v103),
      oa_supportingwing_v103: this.getFromSupportWingMap(
        data.supportingwing_v103,
      ),
    };
  }

  async storePdfUrl(
    pdfUrl: string,
    submission: DietWeeklySubmissionData,
    formId: string,
  ) {
    const gqlQuery = `mutation {
      insert_diet_weekly_reports_one(object: {
        creation_date: "${submission.month}",
        mentor_username: "${submission.user_name}",
        odk_form_id: "${formId}", 
        pdf_url: "${pdfUrl}", 
        submission_date: "${submission['*meta-submission-date*']}", 
        week: "${this.getFromWeekMap(submission.week)}", 
        wing: "${this.getWingNameShortForm(submission.wingname)}"
      }) {
        pdf_url
      }
    }`;

    return this.appService.sendGqlRequest(gqlQuery);
  }

  dumpSubmission(submission: DietWeeklySubmissionData) {
    const mapping = this.createMappingForPdf(submission);
    const gqlQuery = `mutation {
      insert_diet_weekly_data_one(object: {
        instance_id: "${submission.instanceID}", 
        month: "${mapping.month}", 
        oa_authority: "${mapping.oa_authority}", 
        oa_description: "${mapping.oa_description}", 
        oa_misc_undertaken: "${mapping.oa_misc_undertaken}", 
        oa_pictures: "", 
        oa_supportingwing_v103: "${mapping.oa_supportingwing_v103}", 
        oa_typeofprojects_v103: "${mapping.oa_typeofprojects_v103}", 
        oa_wingsupport_v103: "${mapping.oa_wingsupport_v103}", 
        scert_description: "${mapping.scert_description}", 
        scert_pictures: "", 
        scert_supportingwing_v102: "${mapping.scert_supportingwing_v102}", 
        scert_typeofprojects_v102: "${mapping.scert_typeofprojects_v102}", 
        scert_undertaken: "${mapping.scert_scert_undertaken}", 
        scert_wingsupport_v102: "${mapping.scert_wingsupport_v102}", 
        suomotu_description: "${mapping.suo_description}", 
        suomotu_pictures: "", 
        suomotu_supportingwing_v101: "${mapping.suo_supportingwing_v101}", 
        suomotu_typeofprojects_v101: "${mapping.suo_typeofprojects_v101}", 
        suomotu_undertaken: "${mapping.suo_suomotu_undertaken}", 
        suomotu_wingsupport_v101: "${mapping.suo_wingsupport_v101}", 
        total_completed_projects: "${mapping.tp_completed_projects}", 
        total_planned_projects: "${mapping.tp_planned_projects}", 
        total_started_projects: "${mapping.tp_started_projects}", 
        username: "${mapping.username}",
        week: "${mapping.week}", 
        wingname: "${mapping.wingname}", 
        year: "${mapping.year}"
      }) {
        instance_id
      }
    }`;

    return this.appService.sendGqlRequest(gqlQuery);
  }
}
