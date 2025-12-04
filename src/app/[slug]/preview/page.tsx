import Preview from '@/components/preview/preview';
import { companyService } from '@/lib/services/company-service';
import { redirect } from 'next/navigation';

async function page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const userResponse = await companyService.retrieve();

  if (("error" in userResponse) || userResponse.slug !== slug) {
    redirect("/")
  }

  const company = await companyService.retrieve(slug);

  if (!("error" in company)) {
    return (
      <Preview
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