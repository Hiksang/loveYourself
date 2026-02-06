export type PickupLocation = {
  id: string;
  type: "convenience" | "locker";
  name: string;
  address: string;
  area: string;
  hours: string;
};

export const pickupLocations: PickupLocation[] = [
  // 편의점
  {
    id: "cv-001",
    type: "convenience",
    name: "CU 강남역점",
    address: "서울 강남구 강남대로 396",
    area: "강남",
    hours: "24시간",
  },
  {
    id: "cv-002",
    type: "convenience",
    name: "GS25 홍대입구점",
    address: "서울 마포구 양화로 160",
    area: "홍대",
    hours: "24시간",
  },
  {
    id: "cv-003",
    type: "convenience",
    name: "세븐일레븐 이태원점",
    address: "서울 용산구 이태원로 200",
    area: "이태원",
    hours: "24시간",
  },
  {
    id: "cv-004",
    type: "convenience",
    name: "CU 신촌역점",
    address: "서울 서대문구 신촌로 100",
    area: "신촌",
    hours: "24시간",
  },
  {
    id: "cv-005",
    type: "convenience",
    name: "GS25 잠실역점",
    address: "서울 송파구 올림픽로 300",
    area: "잠실",
    hours: "24시간",
  },
  // 무인택배함
  {
    id: "lk-001",
    type: "locker",
    name: "스마트택배함 강남역 2번출구",
    address: "서울 강남구 강남대로 지하 396",
    area: "강남",
    hours: "05:00-24:00",
  },
  {
    id: "lk-002",
    type: "locker",
    name: "스마트택배함 홍대 메인거리",
    address: "서울 마포구 와우산로 94",
    area: "홍대",
    hours: "06:00-23:00",
  },
  {
    id: "lk-003",
    type: "locker",
    name: "스마트택배함 서울역",
    address: "서울 용산구 한강대로 405",
    area: "서울역",
    hours: "05:00-01:00",
  },
  {
    id: "lk-004",
    type: "locker",
    name: "스마트택배함 여의도역",
    address: "서울 영등포구 여의대로 지하 108",
    area: "여의도",
    hours: "06:00-24:00",
  },
  {
    id: "lk-005",
    type: "locker",
    name: "스마트택배함 판교역",
    address: "경기 성남시 분당구 판교역로 지하 160",
    area: "판교",
    hours: "06:00-23:00",
  },
];

export function getLocationsByArea(area: string): PickupLocation[] {
  return pickupLocations.filter((l) =>
    l.area.toLowerCase().includes(area.toLowerCase())
  );
}

export function getLocationsByType(type: "convenience" | "locker"): PickupLocation[] {
  return pickupLocations.filter((l) => l.type === type);
}
