export default function PanelLoading() {
  return (
    <div className="adm-skel" aria-busy="true" aria-label="Carregando">
      <span className="adm-skel__line adm-skel__line--sm" />
      <span className="adm-skel__line adm-skel__line--lg" />
      <span className="adm-skel__block" />
    </div>
  );
}
