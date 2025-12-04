import Careers from '@/components/careers/careers';
import { companyService } from '@/lib/services/company-service';

async function page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const company = await companyService.retrieve(slug);

  if (!("error" in company)) {
    return (
      <Careers
        slug={slug}
        company={company} />
    )
  } else {
    <div className='w-full h-full p-5 text-center font-semibold'>
      No Data available!
    </div>
  }
}

export default page