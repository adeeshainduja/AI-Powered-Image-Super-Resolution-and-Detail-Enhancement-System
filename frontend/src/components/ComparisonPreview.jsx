const SAMPLES = [
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1zdaEVm5c9gKjOPaW7WYGm6MRD4an6gPUD89JRDY3yTgtDXOkspb8CWsv2aXI3p0Ewokqafuf82srvCNBEd6_fwWkwILxMo75Eufl-IU2X72LedbCmc-oJzUYdY3t-qDGkRACfCXOy4G040Pplxm15e4IXnP_FbgczbrHXqg2fcv7YuOfUN_QpQD4N1nYA-ZxqqpJ-UnFDZ8qSgYfZSwczmUIep_jMhl4oqEroTj485fIRr6X-u9pHdteB8HzXnCCm6cscs7vMUA',
    alt: 'Cinematic AI-upscaled portrait sample',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA18ss0PeZCkOu8T60YpikeJm_IrPt-tdrJipVfk6kBzk_H_Y1gyJKYC-mWbpSjGMgblMM6LrqmmR6jVKuS0O1cP14TpQNDthTL_hAFWihfPbVvEf4t9MMeVj09Mvo4X2HoZkxEA5Uy1NgkNBnoF39nxhzsUB3dMmgPSAq3NwgRmkGHDvbeJmYeMfBGW62chwJCQIA3pV82BUsNiNHQJDmLfXHhe4kwLCCFZrjsZJVL_oWUAOkxaGZbRvp5Gw6ysOOnWNjnDHtsjVc',
    alt: 'Futuristic neon city landscape sample',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAekKGu7viAsftNMuvhh_p32fIlXeGu4jD7oODm49fXqkj3jLjg_Sq659jI3yrJuTfKI6PjuxAzNzxnW6PRmoZOFUzMLEUjTwUM-UEK0L9SaYXn_nuGVams00aF4suiEi58WtIDTjN2cfa8b6gexiQywjsAhLb4A-hP-LLCNN19nSOt4G0-qgq9X-RwzmyMfO4IPmvXQ_Vd_87GY2lFNGkOmZpsw5o9w3t8IFB06GAYcHPFDGQcr5k1vTr6tbbsio6Sx8pP9znOGyQ',
    alt: 'Macro mechanical watch sample',
  },
]

export default function ComparisonPreview() {
  return (
    <div className="mt-md grid grid-cols-3 gap-md">
      {SAMPLES.map((sample, i) => (
        <button
          key={i}
          type="button"
          className="aspect-square rounded-xl overflow-hidden glass-panel inner-glow-border group cursor-pointer"
        >
          <img
            src={sample.src}
            alt={sample.alt}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
          />
        </button>
      ))}
    </div>
  )
}
