import type { BaseTranslation } from '../i18n-types'

const pt = {
	// TODO: your translations go here
	App: {
		Loading: "A carregar",
		NoLogin: "Sem Login",
		NoLoginDesc: "O utilizador necessita de fazer o login antes de acessar a página.",
		NoUserProfileType: "Utilizador não tem tipo de perfil",
		NoUserProfileTypeDesc: "O utilizador não tem nenhum tipo de perfil associado seja frontoffice ou backoffice. Tente solucionar este problema antes de acessar a página."
	},
	CreateTemplates: {
		AddRatingOption: "Adicionar opção de classificação",
		CategoriesAndQuestionsDesc: "Passo para criação das categorias e questões associadas ao modelo.",
		CategoriesAndQuestionsTitle: "Criar categorias e questões",
		Continue: "Continuar",
		DeleteRatingOption: "Remover opção de classificação",
		Description: "Esta página permite a criação de modelos de questionários para usar nas avaliações, mantendo assim um padrão consistente e uniforme entre avaliações. Para cada modelo podem ser definidas várias categorias e adicionar questões a cada categoria.",
		NoLanguagesError: "Necessário associar pelo menos uma linguagem ao modelo",
		NoRatingOptions: "Modelo não tem qualquer opção de classificação associada",
		NumericValue: "Valor numérico",
		RatingOptionsDesc: "As opções de classificação servem como opções de resposta nas questões categorizadas como tipo Rating. Se o inquérito contar com perguntas do tipo Rating, deverá criar as opções que deseja. Caso não exista esse tipo de perguntas, este passo pode ser passado.",
		RatingOptionsTitle: "Criar as opções de classificação",
		RtoDescPlaceholder: "Insira a descrição",
		RtoTitlePlaceholder: "Insira o título",
		SelectedLanguage: "Idioma selecionado",
		SelectLangs: "Selecionar idiomas para criar o modelo",
		TemplateDescDesc: "Inserir uma descrição para o modelo",
		TemplateDescTitle: "Descrição do modelo",
		TemplateTitleDesc: "Inserir um título para o modelo",
		TemplateTitleTitle: "Título do modelo",
		Title: "Criar modelo"
	},
	Header: {
		Home: "Início"
	},
	HomeBackoffice: {
		ActiveReviews: "Avaliações Ativas",
		CompletedReviews: "Avaliações Completas",
		Reviews: "Avaliações",
		Templates: "Modelos"
	},
	Languages: {
		EN: "Inglês",
		ES: "Espanhol",
		FR: "Francês",
		PL: "Polaco",
		PT: "Português"
	},
	Menu: {
		Home: "Início",
		Performance: "Desempenho",
		Permissions: "Permissões",
		Reviews: "Avaliações",
		Statistics: "Estatísticas",
		Submissions: "Submissões",
		TeamPerformance: "Desempenho Equipa",
		Templates: "Modelos"
	},
	Permissions: {
		ChooseProfile: "Selecionar perfil",
		ChooseProfileDesc: "Selecione o perfil ao qual deseja alterar as permissões",
		Loading: "A carregar",
		PermissionType: {
			Create: "Criar",
			Delete: "Remover",
			Patch: "Alterar estado",
			Read: "Acessar",
			Update: "Editar"
		},
		PermissionsSave: "Permissões do perfil guardadas com sucesso",
		PermissionsSaveError: "Ocorreu um erro ao tentar gravar as permissões do perfil",
		Save: "Guardar"
	},
	Sidebar: {
		Backoffice: "Menu Backoffice",
		Frontoffice: "Menu Frontoffice",
		Hello: "Olá",
		User: "Utilizador"
	},
	Steps: {
		Details: "Detalhes",
		Categories: "Categorias e questões",
		Finalize: "Finalizar",
		Forward: "Avançar",
		RatingOptions: "Opções de classificação",
		Return: "Voltar"
	},
	Templates: {
		CreateTemplate: "Criar modelo",
		Error: "Erro ao tentar listar os modelos",
		InputText: "Filtrar modelos pelo título...",
		NoTemplates: "Não existem modelos disponíveis de momento. Volte mais tarde ou crie um novo modelo para começar!",
		NoTemplatesFilter: "Não foram encontrados modelos que correspondam à sua pesquisa. Tente ajustar as palavras-chave ou limpe o filtro para ver todos os modelos disponíveis.",
		Preview: "Pré Visualizar",
		ShowingItemsLabel: "Exibindo {firstElement} até {pageSize} de {total} items",
		Templates: "Modelos",
		ToastDelete: "Modelo removido com successo.",
		ToastErrorDelete: "Erro ao remover modelo. Tente de novo."
	}
} satisfies BaseTranslation

export default pt
