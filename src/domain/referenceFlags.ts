import argentina from "svg-country-flags/svg/ar.svg";
import algeria from "svg-country-flags/svg/dz.svg";
import australia from "svg-country-flags/svg/au.svg";
import austria from "svg-country-flags/svg/at.svg";
import bangladesh from "svg-country-flags/svg/bd.svg";
import belgium from "svg-country-flags/svg/be.svg";
import brazil from "svg-country-flags/svg/br.svg";
import canada from "svg-country-flags/svg/ca.svg";
import chile from "svg-country-flags/svg/cl.svg";
import china from "svg-country-flags/svg/cn.svg";
import colombia from "svg-country-flags/svg/co.svg";
import cuba from "svg-country-flags/svg/cu.svg";
import czechia from "svg-country-flags/svg/cz.svg";
import denmark from "svg-country-flags/svg/dk.svg";
import egypt from "svg-country-flags/svg/eg.svg";
import ethiopia from "svg-country-flags/svg/et.svg";
import fiji from "svg-country-flags/svg/fj.svg";
import finland from "svg-country-flags/svg/fi.svg";
import france from "svg-country-flags/svg/fr.svg";
import germany from "svg-country-flags/svg/de.svg";
import ghana from "svg-country-flags/svg/gh.svg";
import greece from "svg-country-flags/svg/gr.svg";
import iceland from "svg-country-flags/svg/is.svg";
import india from "svg-country-flags/svg/in.svg";
import indonesia from "svg-country-flags/svg/id.svg";
import ireland from "svg-country-flags/svg/ie.svg";
import israel from "svg-country-flags/svg/il.svg";
import italy from "svg-country-flags/svg/it.svg";
import jamaica from "svg-country-flags/svg/jm.svg";
import japan from "svg-country-flags/svg/jp.svg";
import kenya from "svg-country-flags/svg/ke.svg";
import malaysia from "svg-country-flags/svg/my.svg";
import mexico from "svg-country-flags/svg/mx.svg";
import morocco from "svg-country-flags/svg/ma.svg";
import nepal from "svg-country-flags/svg/np.svg";
import netherlands from "svg-country-flags/svg/nl.svg";
import newZealand from "svg-country-flags/svg/nz.svg";
import nigeria from "svg-country-flags/svg/ng.svg";
import norway from "svg-country-flags/svg/no.svg";
import pakistan from "svg-country-flags/svg/pk.svg";
import palestine from "svg-country-flags/svg/ps.svg";
import peru from "../assets/flags/pe.svg";
import philippines from "svg-country-flags/svg/ph.svg";
import poland from "svg-country-flags/svg/pl.svg";
import portugal from "svg-country-flags/svg/pt.svg";
import russia from "svg-country-flags/svg/ru.svg";
import saudiArabia from "svg-country-flags/svg/sa.svg";
import singapore from "svg-country-flags/svg/sg.svg";
import southAfrica from "svg-country-flags/svg/za.svg";
import southKorea from "svg-country-flags/svg/kr.svg";
import spain from "svg-country-flags/svg/es.svg";
import sweden from "svg-country-flags/svg/se.svg";
import switzerland from "svg-country-flags/svg/ch.svg";
import thailand from "svg-country-flags/svg/th.svg";
import turkey from "svg-country-flags/svg/tr.svg";
import ukraine from "svg-country-flags/svg/ua.svg";
import unitedArabEmirates from "svg-country-flags/svg/ae.svg";
import unitedKingdom from "svg-country-flags/svg/gb.svg";
import unitedStates from "svg-country-flags/svg/us.svg";
import vietnam from "svg-country-flags/svg/vn.svg";

// Public-domain, Wikimedia-derived vectors bundled by svg-country-flags.

export type ReferenceFlag = {
  src: string;
  aspectRatio: number;
};

export const REFERENCE_FLAG_BY_COUNTRY_ID: Readonly<
  Record<string, ReferenceFlag>
> = {
  japan: { src: japan, aspectRatio: 3 / 2 },
  bangladesh: { src: bangladesh, aspectRatio: 5 / 3 },
  france: { src: france, aspectRatio: 3 / 2 },
  germany: { src: germany, aspectRatio: 5 / 3 },
  italy: { src: italy, aspectRatio: 3 / 2 },
  ireland: { src: ireland, aspectRatio: 2 },
  netherlands: { src: netherlands, aspectRatio: 3 / 2 },
  poland: { src: poland, aspectRatio: 8 / 5 },
  ukraine: { src: ukraine, aspectRatio: 3 / 2 },
  finland: { src: finland, aspectRatio: 18 / 11 },
  sweden: { src: sweden, aspectRatio: 8 / 5 },
  denmark: { src: denmark, aspectRatio: 37 / 28 },
  turkey: { src: turkey, aspectRatio: 3 / 2 },
  pakistan: { src: pakistan, aspectRatio: 3 / 2 },
  india: { src: india, aspectRatio: 3 / 2 },
  canada: { src: canada, aspectRatio: 2 },
  "united-states": { src: unitedStates, aspectRatio: 19 / 10 },
  brazil: { src: brazil, aspectRatio: 10 / 7 },
  "south-africa": { src: southAfrica, aspectRatio: 3 / 2 },
  australia: { src: australia, aspectRatio: 2 },
  spain: { src: spain, aspectRatio: 3 / 2 },
  belgium: { src: belgium, aspectRatio: 15 / 13 },
  austria: { src: austria, aspectRatio: 3 / 2 },
  switzerland: { src: switzerland, aspectRatio: 1 },
  norway: { src: norway, aspectRatio: 11 / 8 },
  greece: { src: greece, aspectRatio: 3 / 2 },
  israel: { src: israel, aspectRatio: 11 / 8 },
  china: { src: china, aspectRatio: 3 / 2 },
  "south-korea": { src: southKorea, aspectRatio: 3 / 2 },
  mexico: { src: mexico, aspectRatio: 7 / 4 },
  argentina: { src: argentina, aspectRatio: 8 / 5 },
  colombia: { src: colombia, aspectRatio: 3 / 2 },
  nigeria: { src: nigeria, aspectRatio: 2 },
  egypt: { src: egypt, aspectRatio: 3 / 2 },
  morocco: { src: morocco, aspectRatio: 3 / 2 },
  "saudi-arabia": { src: saudiArabia, aspectRatio: 3 / 2 },
  indonesia: { src: indonesia, aspectRatio: 3 / 2 },
  thailand: { src: thailand, aspectRatio: 3 / 2 },
  vietnam: { src: vietnam, aspectRatio: 3 / 2 },
  "new-zealand": { src: newZealand, aspectRatio: 2 },
  "united-kingdom": { src: unitedKingdom, aspectRatio: 2 },
  portugal: { src: portugal, aspectRatio: 3 / 2 },
  russia: { src: russia, aspectRatio: 3 / 2 },
  czechia: { src: czechia, aspectRatio: 3 / 2 },
  iceland: { src: iceland, aspectRatio: 25 / 18 },
  philippines: { src: philippines, aspectRatio: 2 },
  malaysia: { src: malaysia, aspectRatio: 2 },
  singapore: { src: singapore, aspectRatio: 3 / 2 },
  "united-arab-emirates": { src: unitedArabEmirates, aspectRatio: 2 },
  nepal: { src: nepal, aspectRatio: 71.571 / 87.246 },
  chile: { src: chile, aspectRatio: 3 / 2 },
  peru: { src: peru, aspectRatio: 3 / 2 },
  cuba: { src: cuba, aspectRatio: 2 },
  jamaica: { src: jamaica, aspectRatio: 2 },
  kenya: { src: kenya, aspectRatio: 3 / 2 },
  ethiopia: { src: ethiopia, aspectRatio: 2 },
  ghana: { src: ghana, aspectRatio: 3 / 2 },
  algeria: { src: algeria, aspectRatio: 3 / 2 },
  fiji: { src: fiji, aspectRatio: 2 },
  palestine: { src: palestine, aspectRatio: 2 }
};

export const getReferenceFlag = (countryId: string): ReferenceFlag => {
  const flag = REFERENCE_FLAG_BY_COUNTRY_ID[countryId];

  if (!flag) {
    throw new Error(`Missing reference flag artwork for ${countryId}`);
  }

  return flag;
};
