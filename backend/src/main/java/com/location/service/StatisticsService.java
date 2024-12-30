package com.location.service;
import java.util.List;
import java.util.Map;

public interface StatisticsService {
    double getTotalIncome();
    int getReservations();
    int getActiveVehicles();
    double getOccupancyRate();
    List<Map<String, Object>> getMonthlyIncome();
    List<Map<String, Object>> getVehicleRotation();
}
