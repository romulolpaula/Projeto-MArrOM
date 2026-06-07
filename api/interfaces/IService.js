module.exports = class IService {
  create(dados) {
    throw new Error(
      `[IService] O método 'create' deve ser implementado por ${this.constructor.name}`,
    );
  }

  findAll() {
    throw new Error(
      `[IService] O método 'findAll' deve ser implementado por ${this.constructor.name}`,
    );
  }

  findById(id) {
    throw new Error(
      `[IService] O método 'findById' deve ser implementado por ${this.constructor.name}`,
    );
  }

  update(id, dados) {
    throw new Error(
      `[IService] O método 'update' deve ser implementado por ${this.constructor.name}`,
    );
  }

  delete(id) {
    throw new Error(
      `[IService] O método 'delete' deve ser implementado por ${this.constructor.name}`,
    );
  }
};
