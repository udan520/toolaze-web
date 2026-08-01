import { permanentRedirect } from 'next/navigation'

export const dynamic = 'force-static'

export default function Seedance2AllToolsRedirect() {
  permanentRedirect('/model/seedance-2')
}
