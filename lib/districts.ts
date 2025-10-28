export const CITIES = ["杭州"] as const

export const DISTRICTS: Record<string, string[]> = {
  杭州: [
    "西湖区",
    "上城区",
    "拱墅区",
    "滨江区",
    "萧山区",
    "余杭区",
    "临平区",
    "钱塘区",
    "富阳区",
    "临安区",
    "桐庐县",
    "淳安县",
    "建德市",
  ],
}

export const HANGZHOU_DISTRICTS = DISTRICTS["杭州"]
