import { describe, expect, it } from 'vitest';
import { jsonLdMigalhas, jsonLdOrganizacao, jsonLdPerguntas, metadados } from '@/lib/seo';
import { PERGUNTAS } from '@/content/faq';
import { ROTAS } from '@/lib/site';
import { COMPANY } from '@/lib/company';

describe('metadados', () => {
  it('cada página tem título, descrição e canónico', () => {
    const m = metadados({ titulo: 'Parcerias', caminho: '/parcerias' });
    expect(m.title).toBe('Parcerias');
    expect(String(m.description).length).toBeGreaterThan(40);
    expect(String(m.alternates?.canonical)).toContain('/parcerias');
  });

  it('a descrição cabe no que os motores de busca mostram', () => {
    const m = metadados({ titulo: 'Início', caminho: '/' });
    expect(String(m.description).length).toBeLessThanOrEqual(320);
  });

  it('as páginas marcadas como não indexáveis dizem-no', () => {
    const m = metadados({ titulo: 'Unidade', caminho: '/l', indexavel: false });
    expect(m.robots).toEqual({ index: false, follow: true });
  });
});

describe('dados estruturados', () => {
  it('a organização leva firma, NIPC e sede, que é o que dá credibilidade a quem verifica', () => {
    const org = jsonLdOrganizacao();
    expect(org.legalName).toBe(COMPANY.legalName);
    expect(org.vatID).toContain(COMPANY.nif);
    expect(org.address.streetAddress).toBe(COMPANY.address);
  });

  it('as perguntas frequentes viram FAQPage sem perder nenhuma', () => {
    const faq = jsonLdPerguntas(PERGUNTAS);
    expect(faq.mainEntity).toHaveLength(PERGUNTAS.length);
    expect(faq.mainEntity[0].acceptedAnswer.text.length).toBeGreaterThan(20);
  });

  it('as migalhas ficam numeradas por ordem', () => {
    const m = jsonLdMigalhas([
      { titulo: 'Início', caminho: '/' },
      { titulo: 'Parcerias', caminho: '/parcerias' },
    ]);
    expect(m.itemListElement.map((i) => i.position)).toEqual([1, 2]);
  });
});

describe('conteúdo', () => {
  it('nenhuma rota fica sem título', () => {
    for (const r of ROTAS) expect(r.titulo.trim().length).toBeGreaterThan(0);
  });

  it('as perguntas frequentes têm resposta e grupo válido', () => {
    for (const p of PERGUNTAS) {
      expect(p.resposta.trim().length).toBeGreaterThan(30);
      expect(['utilizador', 'parceiro']).toContain(p.grupo);
    }
  });
});
