import { JobParams } from "@/types/jobs/module";

export const getParams = (params:JobParams):string => {
    let urlParams = "";
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                urlParams += `&${key}=${value}`;
            }
        });
    }

    return urlParams;
};