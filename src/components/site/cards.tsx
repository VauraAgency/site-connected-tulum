import type { Villa } from "../../content/site";

export function VillaCard({ v }: { v: Villa }) {
  return (
    <a href={`/villas/${v.slug}`} className="vcard" data-rise>
      <div className="vcard__img">
        <img src={v.images[0]} alt={`${v.name}, ${v.area}`} loading="lazy" width={800} height={600} />
        {v.owned && <span className="vcard__tag mono">Connected</span>}
        {v.placeholder && <span className="vcard__soon mono">Details soon</span>}
      </div>
      <div className="vcard__b">
        <h3>{v.name}</h3>
        <div className="vcard__m">
          <span>{v.guests ? `Up to ${v.guests} guests` : v.area}</span>
          <span><b>Inquire</b> <small>direct rate</small></span>
        </div>
      </div>
    </a>
  );
}

