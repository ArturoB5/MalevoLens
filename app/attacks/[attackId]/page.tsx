import { attackModules } from "@/infrastructure/attackData";
import { AttackPageContent } from "@/presentation/components/AttackPageContent";

type AttackPageProps = {
  params: Promise<{
    attackId: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return attackModules.map((attackModule) => ({
    attackId: attackModule.id
  }));
}

export default async function AttackPage({ params }: AttackPageProps) {
  const { attackId } = await params;
  return <AttackPageContent attackId={attackId} />;
}
