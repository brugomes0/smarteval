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
	Header: {
		Home: "Início"
	},
	HomeBackoffice: {
		ActiveReviews: "Avaliações Ativas",
		CompletedReviews: "Avaliações Completas",
		Reviews: "Avaliações",
		Templates: "Modelos"
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
