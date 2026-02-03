import { checkAuthentication } from "@/services/AuthService";
import {
  getEventFromSlug,
  getRegistrationStatus,
} from "@/services/EventsService";
import NotRegistered from "@/components/EventRegistration/NotRegistered";
import Registered from "@/components/EventRegistration/Registered";
import NotFound from "@/components/NotFound";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = await getEventFromSlug(slug);
  if (!event) return <NotFound />;

  const user = await checkAuthentication(`/eventRegistration/${slug}`);
  const registrationStatus = await getRegistrationStatus(user.id, event);

  if (registrationStatus.status) return <Registered user={user} event={event} team={registrationStatus.team} />;
  else return <NotRegistered user={user} event={event} />;
}
