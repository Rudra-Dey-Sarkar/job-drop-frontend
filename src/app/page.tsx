import Landing from "@/components/landing/landing";
import { companyService } from "@/lib/services/company-service";

export default async function Home() {
  const companiesResponse = await companyService.retrieveList();
  
  return (
    <div>
     <Landing companies={companiesResponse.companies} />
    </div>
  );
}
