import React, { useState, useEffect, useContext } from "react";
import styles from "./FormularioServicos.module.css";
import { maskCNPJ, maskCPF, maskTelefone } from "../../utils/mask";
import { DataContext } from "../../context/DataContext";

export default function FormularioServicos({ onRespostasChange }) {
    const [respostas, setRespostas] = useState([]);
    const [tiposSelecionados, setTiposSelecionados] = useState([]);
    const { servicos } = useContext(DataContext);

    console.log(respostas)

  
    useEffect(() => {
        setRespostas((prev) =>
            prev.filter((r) => tiposSelecionados.includes(r.tipo))
        );
    }, [tiposSelecionados]);

    // Atualiza respostas + envia para o pai
    useEffect(() => {
        if (onRespostasChange) {
            onRespostasChange(respostas);
        }
    }, [respostas, onRespostasChange]);

    // 🔧 Agora armazenando também o tipo
    const handleChange = (servico, tipo, modalidade, field, value) => {
        setRespostas((prev) => {
            // Encontra se já existe uma resposta para esse serviço NA MESMA MODALIDADE
            const existente = prev.find(
                (r) => r.servico === servico && r.modalidade === modalidade
            );

            if (existente) {
                return prev.map((r) =>
                    r.servico === servico && r.modalidade === modalidade
                        ? { ...r, [field]: value, tipo, modalidade }
                        : r
                );
            }

            return [...prev, { servico, tipo, modalidade, [field]: value }];
        });
    };
    // Checkboxes (mas com comportamento de "um só marcado")
    const toggleTipo = (tipo) => {
        setTiposSelecionados((prev) =>
            prev.includes(tipo) ? [] : [tipo]
        );
    };

    return (
        <div className={styles.container}>
            {/* Filtros */}
            <div className={styles.filtros}>
                Tipo de empreendimento
                <div className={styles.filtrosTipoGroup}>
                    <label>
                        <input
                            type="checkbox"
                            checked={tiposSelecionados.includes("Eólica")}
                            onChange={() => toggleTipo("Eólica")}
                        />
                        Eólica
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={tiposSelecionados.includes("Fotovoltaica")}
                            onChange={() => toggleTipo("Fotovoltaica")}
                        />
                        Fotovoltaica
                    </label>
                </div>
            </div>

            {/* Lista de serviços */}
            {tiposSelecionados.length > 0 &&
                Object.keys(servicos).map((modalidade) => (
                    <div key={modalidade} className={styles.modalidade}>
                        <h2 className={styles.modalidadeTitulo}>{modalidade}</h2>

                        {servicos[modalidade]
                            .filter((s) => tiposSelecionados.includes(s.tipo))
                            .map((s) => {
                                const respostaAtual = respostas.find((r) => r.servico === s.servico);

                                return (
                                    <div key={s.id} className={styles.servicoCard}>
                                        <h3 className={styles.servicoTitulo}>
                                            {s.servico} <span className={styles.tipoTag}>({s.tipo})</span>
                                        </h3>

                                        <div className={styles.formGrid}>
                                            {/* Radios Aplica-se */}
                                            <label className={styles.radioGroup}>
                                                Aplica-se:
                                                <div className={styles.radios}>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name={`aplicaSe-${s.id}`}
                                                            value="true"
                                                            checked={respostaAtual?.aplicaSe === true}
                                                            onChange={() =>
                                                                handleChange(s.servico, s.tipo, modalidade, "aplicaSe", true)
                                                            }
                                                        />
                                                        Sim
                                                    </label>

                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name={`aplicaSe-${s.id}`}
                                                            value="false"
                                                            checked={
                                                                respostaAtual?.aplicaSe === false ||
                                                                respostaAtual?.aplicaSe === undefined
                                                            }
                                                            onChange={() =>
                                                                handleChange(s.servico, s.tipo, modalidade, "aplicaSe", false)
                                                            }
                                                        />
                                                        Não
                                                    </label>
                                                </div>
                                            </label>

                                            {/* Só mostra os outros campos se Aplica-se = true */}
                                            {respostaAtual?.aplicaSe && (
                                                <>
                                                    <label className={styles.labelInputs}>
                                                        ART:
                                                        <input
                                                            type="text"
                                                            value={respostaAtual?.art || ""}
                                                            onChange={(e) =>
                                                                handleChange(s.servico, s.tipo, modalidade, "art", e.target.value)
                                                            }
                                                        />
                                                    </label>

                                                    <label className={styles.labelInputs} >
                                                        Empresa:
                                                        <input
                                                            type="text"
                                                            value={respostaAtual?.nomeEmpresa || ""}
                                                            onChange={(e) =>
                                                                handleChange(s.servico, s.tipo, modalidade, "nomeEmpresa", e.target.value)
                                                            }
                                                        />
                                                    </label>

                                                    <label className={styles.labelInputs}>
                                                        Nome do Profissional:
                                                        <input
                                                            type="text"
                                                            value={respostaAtual?.nomeProfissional || ""}
                                                            onChange={(e) =>
                                                                handleChange(s.servico, s.tipo, modalidade, "nomeProfissional", e.target.value)
                                                            }
                                                        />
                                                    </label>

                                                    <label className={styles.labelInputs}>
                                                        CNPJ:
                                                        <input
                                                            type="text"
                                                            placeholder="CNPJ"
                                                            value={respostaAtual?.cnpj || ""}
                                                            onChange={(e) =>
                                                                handleChange(s.servico, s.tipo, modalidade, "cnpj", maskCNPJ(e.target.value))
                                                            }
                                                        />
                                                    </label>

                                                    <label className={styles.labelInputs}>
                                                        CPF:
                                                        <input
                                                            type="text"
                                                            placeholder="CPF"
                                                            value={respostaAtual?.cpf || ""}
                                                            onChange={(e) =>
                                                                handleChange(s.servico, s.tipo, modalidade, "cpf", maskCPF(e.target.value))
                                                            }
                                                        />
                                                    </label>

                                                    <label className={styles.labelInputs}>
                                                        Telefone:
                                                        <input
                                                            type="text"
                                                            placeholder="Telefone"
                                                            value={respostaAtual?.telefone || ""}
                                                            onChange={(e) =>
                                                                handleChange(s.servico, s.tipo, modalidade, "telefone", maskTelefone(e.target.value))
                                                            }
                                                        />
                                                    </label>

                                                    <label className={styles.labelInputs}>
                                                        Email:
                                                        <input
                                                            type="email"
                                                            value={respostaAtual?.email || ""}
                                                            onChange={(e) =>
                                                                handleChange(s.servico, s.tipo, modalidade, "email", e.target.value)
                                                            }
                                                        />
                                                    </label>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                ))}

            {/* Debug */}
            {/*       {tiposSelecionados.length > 0 && (
                <pre className={styles.debug}>
                    {JSON.stringify(respostas, null, 2)}
                </pre>
            )} */}
        </div>
    );
}
