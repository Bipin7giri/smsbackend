import { Request, Response } from "express";
import { AppDataSource } from "../PGDB/data-source";
import { roles } from "../ENUMS/RoleEnum";
import { getCurrentUser } from "../helper/jwt";
import { IsNull, Not } from "typeorm";
import {
  assigmnmentSubmitRepo,
  departmentRepo,
  subjectRepo,
  userRepo,
} from "../Repository";
import { User } from "../entity/User";
import { Subjects } from "../entity/Subject";
// stats for admin
export const studentAccDepartment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await AppDataSource.query(
      "SELECT d.name,COUNT(*) FROM public.user INNER JOIN department as d ON public.user.department_id=d.id GROUP BY d.name"
    );
    res.json(users);
  } catch (err: any) {
    res.json(err.message);
  }
};

export const studentAccSemester = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await AppDataSource.query(
      "SELECT s.name,COUNT(*) FROM public.class INNER JOIN semester as s ON public.class.semester_id = s.id GROUP BY s.name"
    );
    res.json(users);
  } catch (err: any) {
    res.json(err.message);
  }
};

export const countStatus = async (req: Request, res: Response) => {
  try {
    const totalNumberOfuser = await userRepo.count();
    const totalNumberOfDepartment = await departmentRepo.count();
    const totalNumberOfTeacher = await userRepo.count({
      where: {
        roleId: {
          name: roles.TEACHER,
        },
      },
    });
    return res.json({
      users: totalNumberOfuser,
      department: totalNumberOfDepartment,
      totalNumberOfTeacher: totalNumberOfTeacher,
    });
  } catch (err: any) {
    res.json(err.message);
  }
};
function binarySearchByEmailSubstring(
  users: User[],
  substring: string
): User[] {
  const results: User[] = [];
  let left = 0;
  let right = users.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midEmail = users[mid].email;

    if (midEmail.includes(substring)) {
      // Add matching users to the results array
      results.push(users[mid]);
    }

    if (midEmail < substring) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return results;
}
export const binarySearchAlgo = async (req: Request, res: Response) => {
  try {
    const getAllUser = await userRepo.find();

    // Extract the search query from the request
    const search = req.query.search as string;

    // Sort the users by email addresses
    getAllUser.sort((a, b) => a.email.localeCompare(b.email));

    // Perform the binary search
    const foundUsers = binarySearchByEmailSubstring(getAllUser, search);
    let response: User[] = [];
    if (foundUsers.length > 0) {
      foundUsers.forEach((user) => {
        response.push(user);
      });
    } else {
      console.log("first")
      response.push();
    }

    return res.json(response);
  } catch (error) {
    throw error;
  }
};


export const binarySearchAlgoForTeacher = async (req: any, res: Response) => {
  try {
    const currentUser: any = req?.user;
    const subjectId: any = await subjectRepo.findOne({
      where: {
        teacherId: {
          id: currentUser?.id,
        },
      },
      relations:{classId:{studentId:true}}
    });

    const students:any[] = subjectId?.classId.map((item:any,id:number)=>{
      return item?.studentId
    })
    // Extract the search query from the request
    const search = req.query.search as string;
    // Sort the users by email addresses
    students.sort((a, b) => a.email.localeCompare(b.email));

    if(!search||search === undefined||search === "" || search === null){
         return res.json(students)
    }
    // Perform the binary search
    const foundUsers = binarySearchByEmailSubstring(students, search);
    let response: User[] = [];
    if (foundUsers.length > 0) {
      foundUsers.forEach((user) => {
        response.push(user);
      });
    } else {
      response.push();
    }

    return res.json(response);
  } catch (error) {
    throw error;
  }
};

export const getAssigmnmentReportAndAttendanceReports = async (
  req: any,
  res: Response
) => {
  try {
    const currentUser: any = req.user;
    const subjectId: any = await subjectRepo.findOne({
      where: {
        teacherId: {
          id: currentUser?.id,
        },
      },
    });
    const getAssignmentSubmittedList = await assigmnmentSubmitRepo.find({
      where: {
        assigmnmentId: {
          subjectId: {
            id: subjectId.subjectId,
          },
        },
        rating: Not(IsNull()),
      },
      relations: {
        studentId: true,
      },
    });
    // return res.json(getAssignemtSumbitedList)
    const rating: any[] = getAssignmentSubmittedList.map((item: any) => {
      return { [item.studentId.firstName]: parseFloat(item.rating) };
    });

    const result: { [key: string]: { value: number; Count: number } } = {};

    for (const item of rating) {
      for (const key in item) {
        if (result.hasOwnProperty(key)) {
          result[key].value += item[key];
          result[key].Count++;
        } else {
          result[key] = {
            value: item[key] as number,
            Count: 1,
          };
        }
      }
    }

    const output: Array<{
      key: string;
      value: number;
      Count: number;
    }> = Object.entries(result).map(([key, value]) => ({
      key,
      value: value.value,
      Count: value.Count,
    }));

    let total = 0;
    let totalRating = 0;
    let finalData: any = [];
    output.forEach((item: any, id: number) => {
      total = item.Count * 5;
      totalRating = (item.value / total) * 100;
      finalData.push({
        [item.key]: totalRating,
      });
      total = 0;
      totalRating = 0;
    });

    // attendance

    const query = `SELECT
  json_agg(row_to_json(t)) AS result
FROM
  (SELECT
    u.first_name AS key,
    (COUNT(CASE WHEN r.present_id IS NOT NULL THEN 1 END) * 100) / 
    (COUNT(CASE WHEN r.present_id IS NOT NULL THEN 1 END) + 
    COUNT(CASE WHEN r.absent_id IS NOT NULL THEN 1 END)) AS value
  FROM
    public.reports r
  INNER JOIN
    public."user" u ON r.student_id = u.id
  WHERE subject_id = '${subjectId?.id}'
  GROUP BY
    r.student_id, u.first_name) t;
`;
    let finalAttendanceReports: any = [];
    let attendanceReports = await AppDataSource.query(query);
    attendanceReports[0].result.forEach((item: any, id: number) => {
      finalAttendanceReports.push({
        [item.key]: item.value,
      });
    });

    interface Result {
      [key: string]: number;
    }

    const mergedData: Result[] = [...finalAttendanceReports, ...finalData];
    const allKeys: string[] = Array.from(
      new Set(mergedData.flatMap((obj) => Object.keys(obj)))
    );

    const sum: Result[] = allKeys.map((key) => {
      const attendancePercentage: number =
        finalAttendanceReports.find(
          (obj: { hasOwnProperty: (arg0: string) => any }) =>
            obj.hasOwnProperty(key)
        )?.[key] || 0;
      const assignmentPercentage: number =
        finalData.find((obj: { hasOwnProperty: (arg0: string) => any }) =>
          obj.hasOwnProperty(key)
        )?.[key] || 0;
      const overallPercentage: number =
        (attendancePercentage + assignmentPercentage) / 2;
      return { [key]: overallPercentage };
    });

    res.status(200).json({ reports: sum });

    // res.json({ performance: finalData });
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getAttendanceReportByStudentIdForHod = async (
  req: Request,
  res: Response
) => {
  try {
    const { subjectId } = req.params;
    const query = `SELECT
  json_agg(row_to_json(t)) AS result
FROM
  (SELECT
    u.first_name AS key,
    (COUNT(CASE WHEN r.present_id IS NOT NULL THEN 1 END) * 100) / 
    (COUNT(CASE WHEN r.present_id IS NOT NULL THEN 1 END) + 
    COUNT(CASE WHEN r.absent_id IS NOT NULL THEN 1 END)) AS value
  FROM
    public.reports r
  INNER JOIN
    public."user" u ON r.student_id = u.id
  WHERE subject_id = '${subjectId}'
  GROUP BY
    r.student_id, u.first_name) t;
`;
    let attendanceReports = await AppDataSource.query(query);
    res.json({
      reports: attendanceReports[0].result,
    });
  } catch (err) {}
};
